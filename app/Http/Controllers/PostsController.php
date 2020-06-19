<?php

namespace App\Http\Controllers;

use Auth;
use App\Post;
use App\User;
use Illuminate\Http\Request;
use App\Events\PostCreated;
use App\Events\PostModified;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $posts = Post::with('user')->orderBy('id', 'desc')->paginate(5);

        return response()->json([
            'posts' => $posts,
            'user' => $user
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Post $post)
    {
        // create post
        $createdPost = $request->user()->posts()->create([
            'title' => $request->title,
            'body' => $request->body
        ]);

        // broadcast
        broadcast(new PostCreated($createdPost, $request->user()))->toOthers();

        // return response
        return response()->json($post->with('user')->find($createdPost->id));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $post = $user->posts()->where('id', $id)
            ->update(['title' => $request->title, 'body' => $request->body]);

        // broadcast
        event(new PostModified($user));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $post = $user->posts()->where('id', $id)->delete();

        // broadcast
        event(new PostModified($user));
    }
}
