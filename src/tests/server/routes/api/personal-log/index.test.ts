import request from "supertest";
import app from "../../../../../server";

describe("Personal Log Endpoints", () => {
	let server: any;

	beforeEach(() => {
		server = app();
	});

	afterEach(async () => {
		await server.close();
	});

	test("GET /personal-log", async () => {
		const response = await request(server)
			.get("/personal-log")
			.expect(200);

		expect(response.body).toHaveProperty("logs");
	});

	test("POST /personal-log", async () => {
		const data = {
			description: "Test log",
			// Add other required fields
		};

		const response = await request(server)
			.post("/personal-log")
			.send(data)
			.expect(200);

		expect(response.body).toHaveProperty("log");
		expect(response.body.log.description).toBe(data.description);
	});

	test("PUT /personal-log/:id", async () => {
		const logId = 1; // Replace with the actual ID of the log you want to update

		const updatedData = {
			description: "Updated test log",
			// Add other required fields
		};

		const response = await request(server)
			.put(`/personal-log/${logId}`)
			.send(updatedData)
			.expect(200);

		expect(response.body).toHaveProperty("log");
		expect(response.body.log.description).toBe(updatedData.description);
	});

	test("GET /personal-log/:id", async () => {
		const logId = 1; // Replace with the actual ID of the log you want to retrieve

		const response = await request(server)
			.get(`/personal-log/${logId}`)
			.expect(200);

		expect(response.body).toHaveProperty("log");
		expect(response.body.log.id).toBe(logId);
	});

	test("DELETE /personal-log/:id", async () => {
		const logId = 1; // Replace with the actual ID of the log you want to delete

		const response = await request(server)
			.delete(`/personal-log/${logId}`)
			.expect(200);

		expect(response.body).toHaveProperty("log");
		expect(response.body.log.id).toBe(logId);
	});
});
