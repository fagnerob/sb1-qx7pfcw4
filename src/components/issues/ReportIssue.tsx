import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Equipment, EquipmentType } from '../../types/database';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface EquipmentWithType extends Equipment {
  equipment_types: EquipmentType;
}

function ReportIssue() {
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

  async function handleSubmitIssue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const equipmentId = formData.get('equipment_id') as string;
    const description = formData.get('description') as string;

    try {
      const { error } = await supabase
        .from('issues')
        .insert([
          {
            equipment_id: equipmentId,
            reported_by: user.id,
            description,
            status: 'pending',
          },
        ]);

      if (error) throw error;
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Error submitting issue:', err);
      setError('Não foi possível registrar o problema.');
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportar Problema</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">Problema reportado com sucesso!</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmitIssue} className="space-y-6">
          <div>
            <label htmlFor="equipment_id" className="block text-sm font-medium text-gray-700">
              Equipamento
            </label>
            <select
              id="equipment_id"
              name="equipment_id"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione o equipamento...</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.equipment_types.name} - {item.equipment_types.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição do Problema
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Descreva detalhadamente o problema encontrado..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar Relatório'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;