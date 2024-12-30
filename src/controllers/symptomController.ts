import { Request, Response } from 'express';
import { getSymptoms } from '@/services/symptomService';

export const fetchSymptoms = async (req: Request, res: Response) => {
  try {
    const symptoms = await getSymptoms();
    res.status(200).json(symptoms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};