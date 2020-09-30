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
import psdi.mbo.MboSet;
import psdi.mbo.MboSetRemote;
import psdi.util.MXException;

import com.talian.app.heli.Fleet;
import com.talian.app.reservation.Reservation;
import com.talian.app.reservation.ReservationRemote;
import com.talian.app.route.Port;
import com.talian.app.route.Route;
import com.talian.app.scenario.Configuration;
import com.talian.app.scenario.FlightScenario;
import com.talian.app.scenresv.Scenresv;

/**
 * @author Elga
 *
 */
public class Routescenario extends Mbo implements RoutescenarioRemote {
	private FlightScenario flightscenario;
	private HashMap<String, Route> currentRoutes;

	public HashMap<String, Route> getCurrentRoutes() {
		return currentRoutes;
	}

	/**
	 * @param ms
	 * @throws RemoteException
	 */
	public Routescenario(MboSet ms) throws RemoteException {
		super(ms);
		currentRoutes = new HashMap<String, Route>() ;
	}	
	
	@Override
	public void init() throws MXException {
		super.init();
		
		try {
			FlightScenario flightscenario = FlightScenario.readfromMBO(this);		
			HashMap<String, Fleet> fleets = flightscenario.getAvailableFleet() ;
			Iterator<String> it = fleets.keySet().iterator() ;
			while (it.hasNext()) {
				String acreg = it.next() ;
				Fleet fleet = fleets.get(acreg) ;
	
				MboSetRemote scenassset = this.getMboSet("SCENASS321", "SCENASS");
				scenassset.setWhere("scenarioid = '"+this.getString("scenarioid")+"' and acreg='PK-TPE'");
				scenassset.setOrderBy("sequence asc");
				ArrayList<String> ports = new ArrayList<String>() ;
				ArrayList<Boolean> refueling = new ArrayList<Boolean>() ;
				MboRemote sass = scenassset.moveFirst();
				while (sass != null) {
					ports.add(sass.getString("heliport")) ;
					refueling.add(sass.getBoolean("refuel")) ;
	
					sass = scenassset.moveNext() ;
				}
				scenassset.close();
	
				if (! ports.isEmpty()) {
					String [] proposedports = new String[ports.size()] ;
					proposedports = ports.toArray(proposedports) ;
					Route route = fleet.rearrageRoute(proposedports) ;
					for (int pi=0; pi<ports.size(); pi++) {
//						route.setRefueling(ports.get(pi), refueling.get(pi)) ;
					}
	
					MboSetRemote mboset = this.getMboSet("SCENRESV321", "SCENRESV");
					mboset.setWhere("scenarioid = '"+ this.getString("scenarioid") + "' and acreg='PK-TPE' ") ;
					mboset.setOrderBy("sequence");
					Scenresv r = (Scenresv) mboset.moveFirst() ;
					while (r!= null) {
						MboRemote mbo = r.getReservation() ;
						ReservationRemote resv = Reservation.readfromMBO(mbo) ;
					    try {
					    	System.out.println("log for bug" + resv.toString());
					    	route.addPortAtEnd(resv, true) ;
					    }
					    catch (Exception e) {
					    	System.err.println(e) ;
					    }
					    r = (Scenresv) mboset.moveNext();
					}
					currentRoutes.put(acreg, route);
					mboset.close();
				}
			}
		} catch (RemoteException e1) {
			e1.printStackTrace();
		}
	}

	@Override
	public void add() throws MXException, RemoteException {
		super.add();

		this.setValue("status", "DRAFT");
		MboRemote mboremote = this.getOwner();
		if (mboremote != null) {
			this.setValue("reservedate", mboremote.getDate("reserveddate"));
			this.setValue("flightsession", mboremote.getString("flightsession"));
			this.setValue("hasld", 0);
		}
	}
	
	@Override
	protected void save() throws MXException, RemoteException {
		if (this.isNew()) {
			flightscenario = new FlightScenario();
			flightscenario.setMbo(this);
			flightscenario.setScenarioId(this.getString("scenarioid"));
			
			// ### scenconfig
			MboSetRemote configs = this.getMboSet("#defaultscenconfig", "SCENCONFIG") ;
			configs.setWhere("scenarioid is null") ;
			MboRemote cfg = configs.moveFirst() ;
			flightscenario.setConfig(Configuration.readfromMBO(cfg));
			
			// ### availfleets
			MboSetRemote availacregset = this.getMboSet("#availableacreg", "ACREG");
			availacregset.setWhere("status = 'ACTIVE'");
			availacregset.moveFirst();
			MboRemote availacreg = availacregset.moveFirst();
			while (availacreg != null) {
				Fleet flt = Fleet.readfromMBO(flightscenario,availacreg) ;
				flightscenario.setFleetAvailability(availacreg.getString("acreg"), flt, availacreg.getString("status").equals("ACTIVE"));
				availacreg = availacregset.moveNext();
			}
			
			// ### availports		
			MboSetRemote ports = this.getMboSet ("#availableports", "HELIPORT") ;
			ports.setWhere(" portstatus in ('ACTIVE', 'OPEN') and ishelipad = 1 ");
			MboRemote prt = ports.moveFirst() ;
			while (prt != null) {
				Port heliport = Port.readfromMBO(flightscenario,prt);
				flightscenario.availablePorts.put(heliport.getPort(), heliport);
				if (heliport.hasRefuelingCapability())
					flightscenario.refuelingPorts.put(heliport.getPort(), heliport);
				prt  = ports.moveNext();
			}
			flightscenario.save();
		} else {
			
		}
		super.save();
	}
}
