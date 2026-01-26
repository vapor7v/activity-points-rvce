import SupaAuthVerifyEmail from "@/emails";
import supabaseAdmin from "@/lib/supabase/admin";

import { Resend } from "resend";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {

	const data = await request.json();
	const supabase = supabaseAdmin();
	const appName = process.env.NEXT_PUBLIC_APP_NAME!;

	const res = await supabase.auth.admin.generateLink({
		type: "signup",
		email: data.email,
		password: data.password,
	});

	if (res.data.properties?.email_otp) {
		const resendRes = await resend.emails.send({
			from: `${appName} <onboarding@${process.env.NEXT_PUBLIC_RESEND_DOMAIN}>`,
			to: [data.email],
			subject: `${appName} - Verify Email`,
			react: SupaAuthVerifyEmail({
				verificationCode: res.data.properties?.email_otp,
			}),
		});
		return Response.json(resendRes);
	} else {
		return Response.json({ data: null, error: res.error });
	}
}
