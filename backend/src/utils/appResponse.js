class AppResponse {
	constructor(status, data) {
		this.status = status;
		this.data = data;
	}

	toJson() {
		return {
			status: this.status,
			data: this.data
		};
	}
}

module.exports = AppResponse;
