<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Payments',[
            'payments'=>Payment::orderBy('created_at','desc')->get(),
        ]);
    }


    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return  redirect()->back()->with('success','Payment Deleted Successfullu');
    }


    public function update(Request $request, $id)
{
    // Validate the request data
    $request->validate([
        'email' => 'required|email|unique:payments,email,' . $id,
        'amount' => 'required|numeric|min:0',
        'status' => 'required|in:pending,success,failed,processing',
    ]);

    // Find the payment by ID
    $payment = Payment::findOrFail($id);

    // Update the payment details
    $payment->update([
        'email' => $request->email,
        'amount' => $request->amount,
        'status' => $request->status,
    ]);

    return response()->json(['message' => 'Payment updated successfully!'], 200);
}

public function store(Request $request)
{
    // Validate the request data
    $request->validate([
        'email' => 'required|email|unique:payments,email,',
        'amount' => 'required|numeric|min:0',
        'status' => 'required|in:pending,success,failed,processing',
    ]);

    // Update the payment details
   Payment::create([
        'email' => $request->email,
        'amount' => $request->amount,
        'status' => $request->status,
    ]);

    return response()->json(['message' => 'Payment added successfully!'], 200);
}
}
