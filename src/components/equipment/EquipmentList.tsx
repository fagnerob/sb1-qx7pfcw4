import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Equipment, EquipmentType } from '../../types/database';
import { Shield, AlertCircle } from 'lucide-react';

interface EquipmentWithType extends Equipment {
  equipment_types: EquipmentType;
}

function EquipmentList() {
  const [equipment, setEquipment] = useState<EquipmentWithType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          equipment_types (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Não foi possível carregar os equipamentos.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Equipamentos</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {equipment.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Shield className={`h-8 w-8 ${
                item.status === 'active' ? 'text-green-500' : 'text-red-500'
              }`} />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.equipment_types.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.equipment_types.category}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {item.serial_number && (
                <p className="text-sm">
                  <span className="font-medium">Número de Série:</span>{' '}
                  {item.serial_number}
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium">Data de Emissão:</span>{' '}
                {new Date(item.issue_date).toLocaleDateString()}
              </p>
              {item.expiration_date && (
                <p className="text-sm">
                  <span className="font-medium">Data de Validade:</span>{' '}
                  {new Date(item.expiration_date).toLocaleDateString()}
                </p>
              )}
              <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipmentList;