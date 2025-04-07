// HourlyEarningsDisplay.tsx
import React from 'react';
import { Typography } from '@mui/material';
import equipmentModelData from './equipmentModel.json';

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

interface HourlyEarningsDisplayProps {
  equipment: Equipment;
  currentStateId: string;
}

const HourlyEarningsDisplay: React.FC<HourlyEarningsDisplayProps> = ({ equipment, currentStateId }) => {
  // Encontra o modelo do equipamento usando equipmentModelId
  const models = equipmentModelData as EquipmentModel[];
  const model = models.find(m => m.id === equipment.equipmentModelId);
  
  if (!model) {
    return <Typography variant="body1">Modelo não encontrado.</Typography>;
  }
  
  // Busca o ganho por hora para o estado atual
  const earning = model.hourlyEarnings.find(e => e.equipmentStateId === currentStateId);
  
  return (
    <Typography variant="body1">
      Ganho por hora: {earning ? earning.value : 'N/A'}
    </Typography>
  );
};

export default HourlyEarningsDisplay;
