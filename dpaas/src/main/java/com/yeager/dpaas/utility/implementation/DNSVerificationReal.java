package com.yeager.dpaas.utility.implementation;

import com.yeager.dpaas.utility.DNSVerification;
import org.xbill.DNS.*;
import org.xbill.DNS.Record;

public class DNSVerificationReal implements DNSVerification {
    public boolean verifyDomain(String domain, String token){
        try{
            Lookup lookup = new Lookup(domain, Type.TXT);
            Record[] records = lookup.run();

            if(records == null) return false;

            for(Record record: records){
                if(record instanceof TXTRecord txt){
                    for(String txtValue: txt.getStrings()){
                        if(txtValue.contains(token)){
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
