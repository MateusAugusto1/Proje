import './App.css';
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



import equipments from './equipment.json';
import equipmentModels from './equipmentModel.json';
import equipmentStates from './equipmentState.json';
import equipmentStateHistories from './equipmentStateHistory.json';
import equipmentPositionHistories from './equipmentPositionHistory.json';


interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

interface HourlyEarning {
  equipmentStateId: string;
  value: number;
}

interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: HourlyEarning[];
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentStateHistoryItem {
  date: string; 
  equipmentStateId: string;
}

interface EquipmentStateHistory {
  equipmentId: string;
  states: EquipmentStateHistoryItem[];
}

interface Position {
  date: string; 
  lat: number;
  lon: number;
}

interface EquipmentPositionHistory {
  equipmentId: string;
  positions: Position[];
}


function getLatestState(equipmentId: string): EquipmentStateHistoryItem | null {
  const history = (equipmentStateHistories as EquipmentStateHistory[]).find(h => h.equipmentId === equipmentId);
  if (history && history.states && history.states.length > 0) {

    
    const sorted = [...history.states].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[sorted.length - 1];
  }
  return null;
}



function createCustomIcon(color: string) {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${color};width:20px;height:20px;border-radius:50%;border:2px solid white;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}




const EquipmentMap: React.FC = () => {

  
  const defaultCenter: [number, number] = [-19.1, -46.0];

  return (
    <MapContainer center={defaultCenter} zoom={10} scrollWheelZoom style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {(equipmentPositionHistories as EquipmentPositionHistory[]).map((ep) => {


        const equipment = (equipments as Equipment[]).find(e => e.id === ep.equipmentId);
        const equipmentName = equipment ? equipment.name : 'Equipamento Desconhecido';


        
        const positions: [number, number][] = ep.positions.map(pos => [pos.lat, pos.lon]);


        
        const latestStateRecord = getLatestState(ep.equipmentId);
        let stateName = 'Desconhecido';
        let stateColor = 'gray';
        let earnings = 0;
        let modelName = 'Desconhecido';

        if (latestStateRecord) {

          
          const state = (equipmentStates as EquipmentState[]).find(s => s.id === latestStateRecord.equipmentStateId);
          if (state) {
            stateName = state.name;
            stateColor = state.color;
          }

          
          if (equipment) {
            const model = (equipmentModels as EquipmentModel[]).find(m => m.id === equipment.equipmentModelId);
            if (model) {
              modelName = model.name;
              const earningObj = model.hourlyEarnings.find(e => e.equipmentStateId === latestStateRecord.equipmentStateId);
              if (earningObj) {
                earnings = earningObj.value;
              }
            }
          }
        }


        
        const customIcon = createCustomIcon(stateColor);

        return (
          <React.Fragment key={ep.equipmentId}>
            {
          }
            {positions.length > 1 && <Polyline positions={positions} pathOptions={{ color: 'blue' }} />}


            {}
            {ep.positions.map((pos, index) => (
              <Marker key={index} position={[pos.lat, pos.lon]} icon={customIcon}>
                <Popup>
                  <div>
                    <strong>{equipmentName}</strong>
                    <br />
                    Modelo: {modelName}
                    <br />
                    Estado Atual: {stateName}
                    <br />
                    Ganho/Hora: {earnings}
                    <br />
                    Data: {new Date(pos.date).toLocaleString()}
                  </div>
                </Popup>
              </Marker>
            ))}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

const App: React.FC = () => {
  return <EquipmentMap />;
};
export default App;











/*
(Funçaõ para ver animaçao de movimentação do equipamento)

function App() {
    return (
      <div className="App">
        <AnimatedEquipmentMap />
      </div>
    );

*/
  