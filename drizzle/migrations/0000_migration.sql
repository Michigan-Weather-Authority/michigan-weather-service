DROP POLICY IF EXISTS "reports authed read" ON public.spotter_reports;
CREATE POLICY "reports own read" ON public.spotter_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "storm photos public read" ON storage.objects;
CREATE POLICY "storm photos owner read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'storm-photos' AND auth.uid()::text = (storage.foldername(name))[1]);