
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/server";
import { sha512 } from "js-sha512";
import { createNotification } from "@/lib/firebase/server-actions";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const payuResponse = Object.fromEntries(formData.entries()) as { [key: string]: string };

    const salt = process.env.NEXT_PUBLIC_PAYU_SALT;
    const key = process.env.NEXT_PUBLIC_PAYU_KEY;

    if (!salt || !key) {
        console.error("PayU Salt or Key is not configured.");
        return NextResponse.redirect(new URL('/user/dashboard?payment=error', req.url));
    }
    
    // Verify the hash
    const status = payuResponse.status;
    const firstname = payuResponse.firstname;
    const amount = payuResponse.amount;
    const txnid = payuResponse.txnid;
    const postedHash = payuResponse.hash;
    const productinfo = payuResponse.productinfo;
    const email = payuResponse.email;
    const udf1 = payuResponse.udf1;
    const udf2 = payuResponse.udf2;
    
    const hashString = `${salt}|${status}||||||||||${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const generatedHash = sha512(hashString);

    if (generatedHash !== postedHash) {
        console.error("PayU hash validation failed.");
        return NextResponse.redirect(new URL('/user/dashboard?payment=tampered', req.url));
    }

    const userId = udf1;
    const planId = udf2;
    const paymentAmount = parseFloat(amount);
    
    if (status === 'success') {
        try {
            const planDoc = await db.collection("subscriptionPlans").doc(planId).get();
            if (!planDoc.exists) throw new Error("Plan not found");
            const plan = planDoc.data();

            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists) throw new Error("User not found");
            const user = userDoc.data();
            
            // 1. Update user's subscription
            await db.collection("users").doc(userId).update({
                subscriptionPlanId: planId
            });

            // 2. Create a payment record
            await db.collection("payments").add({
                userId,
                customer: user?.name || 'N/A',
                email: user?.email || 'N/A',
                plan: plan?.name || 'N/A',
                status: 'succeeded',
                amount: paymentAmount,
                date: new Date(),
                transactionId: txnid,
            });

            // 3. Create a notification for the user
            await createNotification({
                userId,
                title: 'Subscription Changed Successfully',
                message: `Your plan has been successfully updated to ${plan?.name}.`,
                type: 'plan-change',
                isRead: false,
                isArchived: false,
                createdAt: new Date(),
            });
            
            return NextResponse.redirect(new URL('/user/dashboard?payment=success', req.url));

        } catch (error) {
            console.error("Error processing successful payment:", error);
            // Even if DB operations fail, the payment was successful. Redirect with error.
             return NextResponse.redirect(new URL('/user/dashboard?payment=dberror', req.url));
        }

    } else {
        // Payment failed or was cancelled
        return NextResponse.redirect(new URL(`/user/dashboard?payment=failed&reason=${payuResponse.error_Message}`, req.url));
    }
}
