DROP POLICY IF EXISTS "reactions public read" ON public.report_reactions;
CREATE POLICY "reactions own read" ON public.report_reactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "comments public read" ON public.report_comments;
CREATE POLICY "comments own read" ON public.report_comments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.report_reactions FROM anon;
REVOKE SELECT ON public.report_comments FROM anon;