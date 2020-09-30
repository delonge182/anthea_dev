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
package com.talian.app.scenresv;

import java.rmi.RemoteException;

import com.talian.app.reservation.Reservation;
import com.talian.app.reservation.ReservationSet;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

/**
 * @author Elga
 *
 */
public class Scenresv extends Mbo implements ScenresvRemote {

	/**
	 * @param ms
	 * @throws RemoteException
	 */
	public Scenresv(MboSet ms) throws RemoteException {
		super(ms);
		// TODO Auto-generated constructor stub
	}

	public Reservation getReservation() throws RemoteException, MXException {
		ReservationSet reservationset = (ReservationSet) this.getMboSet("reservation");
		if (reservationset.count() > 0) {
			Reservation reservation = (Reservation) reservationset.moveFirst();
			return reservation;
		}
		else {
			return null;
		}		
	}
}
