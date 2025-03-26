<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarouselController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Carousels', [
            'carousels' => Carousel::orderBy('created_at', 'desc')->get(),
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required|string|in:active,inactive',
        ]);

        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('carousel'), $imageName);

        $carousel = new Carousel();
        $carousel->title = $request->title;
        $carousel->description = $request->description;
        $carousel->image = $imageName;
        $carousel->status = $request->status;
        $carousel->save();

        return response()->json($carousel, 201);
    }


    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'image' => 'required',
            'status' => 'required|in:active,inactive',
        ]);

        // Find the payment by ID
        $carousel = Carousel::findOrFail($id);

        // Update the payment details
        $carousel->update([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $request->image,
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Carousel updated successfully!'], 200);
    }


    public function destroy($id)
    {
        $carousel = Carousel::findOrFail($id);
        $carousel->delete();
        return redirect()->back()->with('success', 'Carousel Deleted successfully!');
    }
}
