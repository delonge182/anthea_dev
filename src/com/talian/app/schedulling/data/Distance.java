/*
 *
 * 
 *
 * (C) COPYRIGHT Talian Limited, 2011
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets.
 *
 */
package com.talian.app.schedulling.data;

import java.rmi.RemoteException;

import psdi.mbo.MboRemote;
import psdi.util.MXException;

/**
 * @author Seno
 *
 */
public class Distance {
	String org ;
	String dest ;
	
	public Double nmi ;
	public Double minutes ;
		
	public Distance() {
	}
	
	public String getKey() {
		return org + "-" + dest ;
	}
	
	static Distance getInstance (MboRemote mbo) throws RemoteException, MXException {
		Distance dist = new Distance () ;
		dist.org = mbo.getString("fromport") ;
		dist.dest = mbo.getString("toport") ;
		dist.nmi = mbo.getDouble("nmi") ;
		
		return dist ;
	}
}
