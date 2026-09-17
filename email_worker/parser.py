import re


def parse_email_body(body: str) -> dict | None:
    result = {}

    name_match = re.search(r"Name:\s*(.+)", body)
    email_match = re.search(r"Email:\s*(.+)", body)
    desc_match = re.search(r"Description:\s*(.+?)(?:\n|$)", body, re.DOTALL)

    if not name_match or not email_match or not desc_match:
        return None

    result["customer_name"] = name_match.group(1).strip()
    result["customer_email"] = email_match.group(1).strip()
    result["description"] = desc_match.group(1).strip()

    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_pattern, result["customer_email"]):
        return None

    return result
