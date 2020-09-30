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
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;

/**
 * @author efs
 *
 */
public class ResvonlegSet extends MboSet implements ResvonlegSetRemote {

	/**
	 * @param ms
	 * @throws RemoteException
	 */
	public ResvonlegSet(MboServerInterface ms) throws RemoteException {
		super(ms) ;
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see psdi.bo.MboSet#getMboInstance(psdi.bo.MboSet)
	 */
	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException,
			RemoteException {
		return new Resvonleg(ms) ;
	}

}
