import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import equipmentData from './equipment.json';
import equipmentPositionHistoryData from './equipmentPositionHistory.json';
import equipmentStateData from './equipmentState.json';
import equipmentStateHistoryData from './equipmentStateHistory.json';



interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

interface PositionRecord {
  date: string;
  lat: number;
  lon: number;
}

interface EquipmentPositionHistory {
  equipmentId: string;
  positions: PositionRecord[];
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentStateHistory {
  equipmentId: string;
  states: { date: string; equipmentStateId: string }[];
}


interface EquipmentRoute {
  equipment: Equipment;
  positions: PositionRecord[];
}


const sortPositionsByDate = (positions: PositionRecord[]): PositionRecord[] =>
  [...positions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


const getLatestStateInfo = (equipmentId: string): { stateName: string; color: string } => {
  const stateHistories = equipmentStateHistoryData as EquipmentStateHistory[];
  const states = equipmentStateData as EquipmentState[];
  const hist = stateHistories.find(h => h.equipmentId === equipmentId);
  if (!hist || hist.states.length === 0) return { stateName: 'Desconhecido', color: 'gray' };
  const sorted = [...hist.states].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestStateId = sorted[sorted.length - 1].equipmentStateId;
  const stateObj = states.find(s => s.id === latestStateId);
  return stateObj ? { stateName: stateObj.name, color: stateObj.color } : { stateName: 'Desconhecido', color: 'gray' };
};


const createCustomIcon = (innerColor: string, borderColor: string = 'white') =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${innerColor}; width:20px; height:20px; border-radius:50%; border:2px solid ${borderColor};"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });



const VehicleRoutes: React.FC = () => {

  const [routes, setRoutes] = useState<EquipmentRoute[]>([]);

  const [selectedRoute, setSelectedRoute] = useState<EquipmentRoute | null>(null);
 
  const [showRoute, setShowRoute] = useState(false);

 
  useEffect(() => {
    const equipments = equipmentData as Equipment[];
    const posHistories = equipmentPositionHistoryData as EquipmentPositionHistory[];

    const combined = equipments.map(eq => {
      const history = posHistories.find(ph => ph.equipmentId === eq.id);
      return {
        equipment: eq,
        positions: history && history.positions.length > 0 ? sortPositionsByDate(history.positions) : []
      };
    });
    setRoutes(combined);
  }, []);

  const handleSelect = (route: EquipmentRoute) => {
    setSelectedRoute(route);
    setShowRoute(false); 
  };

  const toggleRoute = () => {
    setShowRoute(prev => !prev);
  };

  
  const mapCenter: [number, number] =
    selectedRoute && selectedRoute.positions.length > 0
      ? [selectedRoute.positions[0].lat, selectedRoute.positions[0].lon]
      : [-19.1, -46.0];

  
  const equipmentStates = equipmentStateData as EquipmentState[];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {}
      <Box sx={{ width: '30%', p: 2, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Veículos
        </Typography>
        <List>
          {routes.map((route) => (
            <ListItem key={route.equipment.id} disablePadding>
              <ListItemButton onClick={() => handleSelect(route)}>
                <ListItemText primary={route.equipment.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {selectedRoute && (
          <Button variant="contained" onClick={toggleRoute} sx={{ mt: 2 }}>
            {showRoute ? 'Ocultar Rota' : 'Mostrar Rota'}
          </Button>
        )}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Legenda de Cores
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cor</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipmentStates.map((state) => (
                  <TableRow key={state.id}>
                    <TableCell>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: state.color,
                          border: '1px solid #000'
                        }}
                      />
                    </TableCell>
                    <TableCell>{state.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {}
      <Box sx={{ flexGrow: 1 }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {}
          {selectedRoute && showRoute && selectedRoute.positions.length > 0 && (
            <>
              <Polyline
                positions={selectedRoute.positions.map(pos => [pos.lat, pos.lon])}
                color={getLatestStateInfo(selectedRoute.equipment.id).color}
              />
              {selectedRoute.positions.map((pos, index) => {
                const stateInfo = getLatestStateInfo(selectedRoute.equipment.id);
                const icon = createCustomIcon(stateInfo.color, 'white');
                return (
                  <Marker key={index} position={[pos.lat, pos.lon]} icon={icon}>
                    <Popup>
                      <Typography variant="body2">
                        Data: {new Date(pos.date).toLocaleString()}
                        <br />
                        Lat: {pos.lat}, Lon: {pos.lon}
                      </Typography>
                    </Popup>
                  </Marker>
                );
              })}
            </>
          )}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default VehicleRoutes;
