ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;

WITH ordered_projects AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) - 1 AS new_order_index
  FROM public.projects
)
UPDATE public.projects p
SET order_index = ordered_projects.new_order_index
FROM ordered_projects
WHERE p.id = ordered_projects.id;

WITH ordered_reviews AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) - 1 AS new_order_index
  FROM public.reviews
)
UPDATE public.reviews r
SET order_index = ordered_reviews.new_order_index
FROM ordered_reviews
WHERE r.id = ordered_reviews.id;
