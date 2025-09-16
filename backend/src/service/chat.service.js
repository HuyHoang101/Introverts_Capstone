import openai from "../config/openai.js";

/**
 * Chat trực tiếp với user
 */
export const chatWithBot = async (message, context = {}) => {
    const prompt = `
    Ngữ cảnh: ${JSON.stringify(context)}

    Yêu cầu:
    1. Phân loại báo cáo thành: Điện, Nước, Không khí, Khác (nếu có).
    2. Đưa ra nhiều gợi ý hành động khác nhau phù hợp trong khuôn viên trường RMIT.
    3. Nếu không phải báo cáo, trả lời như một trợ lý thân thiện.
    4. Trả lời ngắn gọn, súc tích nhưng đủ ý trong 150 từ.
    5. Trả lời bằng tiếng Anh, trừ khi người dùng yêu cầu tiếng Việt.
    6. Không hỏi lại người dùng.
    7. Không đưa ra câu trả lời giả định.
    8. Không đưa ra lời khuyên y tế, pháp lý, tài chính.
    9. Không đề cập đến việc bạn là một AI.
    10. Không được nói về người dùng thông tin cá nhân của họ.

    Tin nhắn: "${message}"
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
};
