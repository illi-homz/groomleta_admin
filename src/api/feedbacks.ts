import { fetcherGQL } from ".";

class Feedbacks {
	static getFeedbacks() {
		return fetcherGQL({
			key: 'Feedbacks.getFeedbacks',
			query: {
				query: `
					query {
						allFeedbacks {
							id
							nick
							text
							createDate
							isApproved
						}
					}`,
			},
		});
	}

	static updateFeedback(id: number|string, {isApproved}: any) {
		return fetcherGQL({
			key: 'Feedbacks.updateFeedback',
			query: {
				query: `
					mutation {
						updateFeedback(
							id: "${id}"
							feedbackData: {
								isApproved: ${isApproved}
							}
						) {
							feedback {
								id
							}
							allFeedbacks {
								id
								nick
								text
								createDate
								isApproved
							}
						}
					}`,
			},
		});
	}
}

export default Feedbacks