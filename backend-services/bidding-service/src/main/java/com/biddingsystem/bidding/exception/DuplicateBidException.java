package com.biddingsystem.bidding.exception;

public class DuplicateBidException extends RuntimeException {
    public DuplicateBidException(String message) {
        super(message);
    }
}
