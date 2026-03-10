import Http from "@/utils/http/http";

const FeedbackApi = {
    getFeedbackList(data?: object) {
        return Http.get('/v1/reply/list', data)
    },
    handleFeedback(data?: object) {
        return Http.post('/v1/reply/addReply', data)
    },
}
export default FeedbackApi