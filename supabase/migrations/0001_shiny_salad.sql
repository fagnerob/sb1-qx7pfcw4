/*
  # Schema inicial do sistema de gerenciamento de EPIs

  1. Novas Tabelas
    - `profiles`
      - Informações dos usuários (colaboradores e supervisores)
    - `equipment_types`
      - Tipos de equipamentos (EPIs e ferramentas)
    - `equipment`
      - Equipamentos específicos associados aos colaboradores
    - `inspections`
      - Registros de inspeções diárias
    - `issues`
      - Problemas reportados com equipamentos

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para colaboradores e supervisores
*/

-- Criar enum para roles
CREATE TYPE user_role AS ENUM ('worker', 'supervisor');

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'worker',
  department text,
  employee_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Equipment types
CREATE TABLE equipment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Equipment
CREATE TABLE equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid REFERENCES equipment_types(id),
  user_id uuid REFERENCES profiles(id),
  serial_number text,
  status text DEFAULT 'active',
  issue_date date NOT NULL,
  expiration_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Daily inspections
CREATE TABLE inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES equipment(id),
  user_id uuid REFERENCES profiles(id),
  condition text NOT NULL,
  notes text,
  inspection_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Issues
CREATE TABLE issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES equipment(id),
  reported_by uuid REFERENCES profiles(id),
  assigned_to uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  description text NOT NULL,
  resolution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Supervisors can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- Equipment types policies
CREATE POLICY "Anyone can view equipment types"
  ON equipment_types FOR SELECT
  TO authenticated
  USING (true);

-- Equipment policies
CREATE POLICY "Users can view their assigned equipment"
  ON equipment FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'supervisor'
  ));

-- Inspections policies
CREATE POLICY "Users can create and view their own inspections"
  ON inspections FOR ALL
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'supervisor'
  ));

-- Issues policies
CREATE POLICY "Users can create issues"
  ON issues FOR INSERT
  WITH CHECK (reported_by = auth.uid());

CREATE POLICY "Users can view their reported issues"
  ON issues FOR SELECT
  USING (
    reported_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );