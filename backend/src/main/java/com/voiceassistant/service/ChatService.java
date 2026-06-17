package com.voiceassistant.service;

import com.voiceassistant.entity.Message;
import com.voiceassistant.entity.User;
import com.voiceassistant.repository.MessageRepository;
import com.voiceassistant.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

	private final ChatClient chatClient;
	private final MessageRepository messageRepository;
	private final UserRepository userRepository;

	@Autowired
	public ChatService(ChatClient.Builder chatClientBuilder, 
	                   MessageRepository messageRepository, 
	                   UserRepository userRepository) {
		this.chatClient = chatClientBuilder.build();
		this.messageRepository = messageRepository;
		this.userRepository = userRepository;
	}

	public String chat(String userMessage, Long userId, String persona) {
		try {
			// Get or create user if needed
			User user = userRepository.findById(userId)
				.orElseGet(() -> {
					User newUser = new User("user_" + userId, "user_" + userId + "@example.com");
					return userRepository.save(newUser);
				});

			// Map persona to system instruction
			String systemPrompt = getSystemPromptForPersona(persona);

			// Call Gemini API using Spring AI Fluent API
			String aiResponse = chatClient.prompt()
				.system(systemPrompt)
				.user(userMessage)
				.call()
				.content();

			// Save conversation to database
			Message message = new Message(userMessage, aiResponse, userId);
			messageRepository.save(message);

			return aiResponse;
		} catch (Exception e) {
			return "Sorry, I encountered an error processing your request: " + e.getMessage();
		}
	}

	private String getSystemPromptForPersona(String persona) {
		if (persona == null) {
			persona = "default";
		}
		switch (persona.toLowerCase()) {
			case "interviewer":
				return "You are a senior software engineering interviewer. Ask the user technical interview questions one by one, evaluate their response concisely, and give constructive feedback. Keep your replies brief, engaging, and in a professional interview tone.";
			case "coach":
				return "You are a patient and supportive English language coach. Talk to the user in friendly, conversational English. If they make any grammar mistakes or suggest weird phrasing in their prompt, correct them gently and suggest a better way to say it, then reply to their question. Keep responses short and simple.";
			case "motivator":
				return "You are a high-energy, positive motivational coach. Respond with enthusiasm, encourage the user, and give uplifting advice. Keep your responses short, energetic, and inspiring!";
			case "default":
			default:
				return "You are a helpful and intelligent AI Voice Assistant. Respond concisely, in a natural conversational tone, suitable for being spoken aloud. Keep your answers brief and to the point.";
		}
	}

	public List<Message> getUserMessages(Long userId) {
		return messageRepository.findByUserIdOrderByCreatedAtDesc(userId);
	}

	public void clearUserMessages(Long userId) {
		List<Message> messages = messageRepository.findByUserId(userId);
		messageRepository.deleteAll(messages);
	}
}
