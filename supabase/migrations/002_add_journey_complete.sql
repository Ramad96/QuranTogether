-- Add is_complete field to journeys
ALTER TABLE public.journeys ADD COLUMN IF NOT EXISTS is_complete BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_journeys_complete ON public.journeys(is_complete);

-- Function: auto-mark journey complete when all units are completed
CREATE OR REPLACE FUNCTION check_journey_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_total   INT;
  v_done    INT;
BEGIN
  SELECT COUNT(*) INTO v_total FROM public.journey_units WHERE journey_id = NEW.journey_id;
  SELECT COUNT(*) INTO v_done  FROM public.journey_units WHERE journey_id = NEW.journey_id AND status = 'COMPLETED';

  UPDATE public.journeys
  SET is_complete = (v_total > 0 AND v_total = v_done)
  WHERE id = NEW.journey_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER journey_units_completion_check
  AFTER INSERT OR UPDATE OF status ON public.journey_units
  FOR EACH ROW EXECUTE FUNCTION check_journey_completion();
