package com.voiceassistant.dto;

public class ChatRequest {
	private String message;
	private Long userId;
	private String persona;

	public ChatRequest() {}

	public ChatRequest(String message, Long userId) {
		this.message = message;
		this.userId = userId;
	}

	public ChatRequest(String message, Long userId, String persona) {
		this.message = message;
		this.userId = userId;
		this.persona = persona;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getPersona() {
		return persona;
	}

	public void setPersona(String persona) {
		this.persona = persona;
	}
}
