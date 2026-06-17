package com.voiceassistant.controller;

import com.voiceassistant.dto.ChatRequest;
import com.voiceassistant.dto.ChatResponse;
import com.voiceassistant.entity.Message;
import com.voiceassistant.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

	@Autowired
	private ChatService chatService;

	@PostMapping("/send")
	public ResponseEntity<?> sendMessage(@RequestBody ChatRequest request) {
		try {
			if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
				return ResponseEntity.badRequest().body(new ChatResponse("Message cannot be empty", null, null));
			}

			String response = chatService.chat(request.getMessage(), request.getUserId(), request.getPersona());
			return ResponseEntity.ok(new ChatResponse(response, null, String.valueOf(System.currentTimeMillis())));
		} catch (Exception e) {
			return ResponseEntity.internalServerError()
					.body(new ChatResponse("Error: " + e.getMessage(), null, null));
		}
	}

	@GetMapping("/history/{userId}")
	public ResponseEntity<List<Message>> getUserHistory(@PathVariable Long userId) {
		List<Message> messages = chatService.getUserMessages(userId);
		return ResponseEntity.ok(messages);
	}

	@DeleteMapping("/clear/{userId}")
	public ResponseEntity<?> clearHistory(@PathVariable Long userId) {
		chatService.clearUserMessages(userId);
		return ResponseEntity.ok("{\"message\": \"History cleared successfully\"}");
	}

	@GetMapping("/health")
	public ResponseEntity<?> health() {
		return ResponseEntity.ok("{\"status\": \"AI Voice Assistant Backend is running\"}");
	}

	@GetMapping("/")
	public String root() {
		return "Backend is running";
	}

}
