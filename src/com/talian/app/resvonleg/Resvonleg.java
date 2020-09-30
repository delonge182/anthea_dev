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
package com.talian.app.resvonleg;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;

/**
 * @author Elga
 *
 */
public class Resvonleg extends Mbo implements ResvonlegRemote {

	public Resvonleg(MboSet ms) throws RemoteException {
		super(ms);
	}
	
}
