/*
 *
 *
 *
 * (C) COPYRIGHT Talian Limited, 2010
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets.
 *
 */
package com.talian.app.routescenario;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import psdi.mbo.Mbo;
import psdi.mbo.MboRemote;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.mbo.MboSetRemote;
import psdi.mbo.custapp.CustomMboSet;
import psdi.util.MXException;

import com.talian.app.heli.Fleet;
import com.talian.app.reservation.Reservation;
import com.talian.app.reservation.ReservationRemote;
import com.talian.app.route.Route;
import com.talian.app.scenario.FlightScenario;
import com.talian.app.scenresv.Scenresv;

/**
 * @author Elga
 *
 */
public class RoutescenarioSet extends CustomMboSet implements RoutescenarioSetRemote {

	/**
	 * @param ms
	 * @throws RemoteException
	 */
	public RoutescenarioSet(MboServerInterface ms) throws RemoteException {
		super(ms);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException,
			RemoteException {
		// TODO Auto-generated method stub
		return new Routescenario(ms);
	}
	
	@Override
	public void init() throws MXException, RemoteException {
		super.init();
		
	}

}
