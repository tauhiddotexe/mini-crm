from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("1. Testing GET /api/health...")
res = client.get("/api/health")
print("Response:", res.status_code, res.json())
assert res.status_code == 200

print("\n2. Testing POST /api/tickets (Create Ticket)...")
ticket_data = {
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "subject": "Test Ticket via Direct Test",
    "description": "Testing backend API endpoints after replacing SVG illustrations."
}
res = client.post("/api/tickets", json=ticket_data)
print("Response:", res.status_code, res.json())
assert res.status_code == 201
ticket_id = res.json()["ticket_id"]

print(f"\n3. Testing GET /api/tickets (List Tickets)...")
res = client.get("/api/tickets")
print("Response:", res.status_code, "Total tickets:", len(res.json()))
assert res.status_code == 200

print(f"\n4. Testing GET /api/tickets/{ticket_id} (Get Ticket Detail)...")
res = client.get(f"/api/tickets/{ticket_id}")
print("Response:", res.status_code, res.json())
assert res.status_code == 200

print(f"\n5. Testing PUT /api/tickets/{ticket_id} (Update Status & Add Note)...")
update_data = {
    "status": "In Progress",
    "notes": "Verified ticket creation and responsiveness."
}
res = client.put(f"/api/tickets/{ticket_id}", json=update_data)
print("Response:", res.status_code, res.json())
assert res.status_code == 200

print("\nAll API endpoint tests passed successfully! ✅")
