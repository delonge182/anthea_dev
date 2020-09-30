package com.talian.beans.routescenario;

import java.rmi.RemoteException;
import java.util.Iterator;
import java.util.Vector;

import psdi.mbo.MboRemote;
import psdi.util.MXException;
import psdi.webclient.system.beans.DataBean;

import com.talian.app.reservation.Reservation;
import com.talian.app.reservation.ReservationRemote;

public class UnservedReservationDataBean extends DataBean {
	public void registertofleet() throws RemoteException, MXException{
		System.out.println(this.getMboSet().getName());
		this.getSelectedDataAsArray();
//		Vector<MboRemote> vreservation = this.getSelection();
//		for (Iterator<MboRemote> iterator = vreservation.iterator(); iterator.hasNext();) {
//			Reservation selectedresv = (Reservation) iterator.next();
//		}
		
		System.err.println(this.getParent().getMboName()); ;
	}
}
