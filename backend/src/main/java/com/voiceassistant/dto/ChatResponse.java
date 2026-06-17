package com.voiceassistant.dto;

public class ChatResponse {
	private String response;
	private Long messageId;
	private String timestamp;

	public ChatResponse() {}

	public ChatResponse(String response, Long messageId, String timestamp) {
		this.response = response;
		this.messageId = messageId;
		this.timestamp = timestamp;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public Long getMessageId() {
		return messageId;
	}

	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
}
