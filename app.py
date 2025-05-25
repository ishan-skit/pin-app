from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import logging

# --- Configuration ---
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- MPIN Analyzer Class ---
class MPINAnalyzer:
    def __init__(self):
        self.common_4_digit = {
            '1234', '0000', '1111', '2222', '3333', '4444', '5555',
            '6666', '7777', '8888', '9999', '1212', '2121', '4321'
        }
        self.common_6_digit = {
            '123456', '654321', '111111', '222222', '000000', '121212'
        }

    def analyze(self, pin, pin_type='4', dob=None, spouse_birthday=None, anniversary=None):
        if not pin or not pin.isdigit():
            return {"error": "PIN must be numeric and not empty."}
        if pin_type not in ['4', '6']:
            return {"error": "PIN type must be 4 or 6 digits."}
        if len(pin) != int(pin_type):
            return {"error": f"PIN must be exactly {pin_type} digits."}

        score = 10
        strength = "STRONG"
        reasons = []

        # Common pattern checks
        if pin_type == '4':
            if pin in self.common_4_digit:
                score -= 9
                strength = "WEAK"
                reasons.append("COMMONLY_USED")
            if self._is_sequence(pin):
                score -= 5
                strength = "WEAK"
                reasons.append("SEQUENTIAL_PATTERN")
        else:
            if pin in self.common_6_digit:
                score -= 9
                strength = "WEAK"
                reasons.append("COMMONLY_USED")
            if self._is_sequence(pin):
                score -= 5
                strength = "WEAK"
                reasons.append("SEQUENTIAL_PATTERN")

        # Demographic matches
        for label, date in [("DOB", dob), ("SPOUSE", spouse_birthday), ("ANNIVERSARY", anniversary)]:
            if date:
                variants = self._extract_date_variants(date, pin_type)
                if pin in variants:
                    score = min(score, 2)
                    strength = "WEAK"
                    reasons.append(f"DEMOGRAPHIC_{label}")

        return {
            "pin": pin,
            "pin_type": pin_type,
            "score": score,
            "strength": strength,
            "reasons": reasons,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        }

    def _is_sequence(self, pin):
        digits = list(map(int, pin))
        return all(digits[i] == digits[i - 1] + 1 for i in range(1, len(digits))) or \
               all(digits[i] == digits[i - 1] - 1 for i in range(1, len(digits)))

    def _extract_date_variants(self, date_str, length):
        try:
            for fmt in ['%Y-%m-%d', '%d-%m-%Y', '%d/%m/%Y']:
                try:
                    dt = datetime.strptime(date_str, fmt)
                    break
                except ValueError:
                    continue
            else:
                return []
        except:
            return []

        d, m, y, ys = f"{dt.day:02d}", f"{dt.month:02d}", str(dt.year), str(dt.year)[-2:]
        if length == '4':
            return {d + m, m + d, ys + m, ys + d, m + ys, d + ys}
        else:
            return {d + m + ys, m + d + ys, ys + m + d, ys + d + m, d + m + y[-2:], m + d + y[-2:]}


# --- Analyzer Instance ---
analyzer = MPINAnalyzer()


# --- Routes ---
@app.route('/')
def index():
    return render_template("index.html", title="Dashboard")

@app.route('/results')
def results():
    sample = [
        analyzer.analyze("1234", "4", dob="2001-01-23"),
        analyzer.analyze("7629", "4"),
        analyzer.analyze("121212", "6", anniversary="2012-12-12")
    ]
    return render_template("results.html", title="Results", results=sample)

@app.route('/test')
def test():
    return render_template("test.html", title="Test Cases")

@app.route('/about')
def about():
    return render_template("about.html", title="About")

@app.route('/contact')
def contact():
    return render_template("contact.html", title="Contact")

@app.route('/notifications')
def notifications():
    notifications_list = [
        "New test case has been added.",
        "Your PIN analysis report is ready.",
        "Security update deployed successfully."
    ]
    return render_template("notifications.html", title="Notifications", notifications=notifications_list)


@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        pin = data.get('pin', '')
        pin_type = data.get('pin_type', '4')
        dob = data.get('dob')
        spouse_birthday = data.get('spouse_birthday')
        anniversary = data.get('anniversary')

        result = analyzer.analyze(pin, pin_type, dob, spouse_birthday, anniversary)
        logger.info(f"Analyzed PIN: {pin} | Result: {result['strength']}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error analyzing PIN: {e}")
        return jsonify({"error": "Server error occurred"}), 500

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "version": "1.0.0", "time": datetime.now().isoformat()})


# --- Error Handlers ---
@app.errorhandler(404)
def not_found(e):
    return render_template("404.html", title="Not Found"), 404

@app.errorhandler(500)
def internal_error(e):
    return render_template("500.html", title="Error"), 500


# --- Run App ---
if __name__ == '__main__':
    print("🚀 MPIN Analyzer Running on http://localhost:5000")
    app.run(debug=True)
