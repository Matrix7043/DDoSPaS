package com.yeager.dpaas.utility.implementation;

import com.yeager.dpaas.utility.DNSVerification;

public class DummyDNSVerification implements DNSVerification {
    public boolean verifyDomain(String domain, String token){
        return true;
    }
}
