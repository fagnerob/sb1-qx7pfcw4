import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Equipment, EquipmentType } from '../../types/database';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface EquipmentWithType extends Equipment {
  equipment_types: EquipmentType;
}

function DailyInspection() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentWithType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        .eq('user_id', user?.id)
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

  async function handleSubmitInspection(equipmentId: string, condition: string, notes: string) {
    if (!user) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('inspections')
        .insert([
          {
            equipment_id: equipmentId,
            user_id: user.id,
            condition,
            notes,
          },
        ]);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting inspection:', err);
      setError('Não foi possível registrar a inspeção.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inspeção Diária</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">Inspeção registrada com sucesso!</span>
        </div>
      )}

      <div className="space-y-6">
        {equipment.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {item.equipment_types.name} - {item.equipment_types.category}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmitInspection(
                  item.id,
                  formData.get('condition') as string,
                  formData.get('notes') as string
                );
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Condição do Equipamento
                </label>
                <select
                  name="condition"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="good">Bom</option>
                  <option value="regular">Regular</option>
                  <option value="bad">Ruim</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Descreva aqui qualquer observação sobre o equipamento..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Registrando...' : 'Registrar Inspeção'}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyInspection;