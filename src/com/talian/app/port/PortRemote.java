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
package com.talian.app.port;


import java.rmi.RemoteException;

import com.ibm.tivoli.maximo.map.interfaces.GISable;
import com.ibm.tivoli.maximo.srvad.app.ServiceAddressRemote;

import psdi.mbo.MboRemote;
import psdi.util.MXException;

/**
 * @author Elga
 *
 */
public interface PortRemote extends MboRemote, GISable{

	public ServiceAddressRemote getServiceAddress() throws MXException, RemoteException;

	public boolean hasServiceAddress() throws MXException, RemoteException;
	
	@Override
	public Double getLatitudeY() throws MXException, RemoteException;
	
	@Override
	public Double getLongitudeX() throws MXException, RemoteException;
	
	@Override
	public String getAddressString() throws MXException, RemoteException;
	
	@Override
	public boolean isGISDataReadonly() throws MXException, RemoteException;
	
	@Override
	public void saveGISData(String arg0, String arg1, String arg2)
			throws MXException, RemoteException;
	
	@Override
	public Boolean hasCoords() throws MXException, RemoteException;
}



