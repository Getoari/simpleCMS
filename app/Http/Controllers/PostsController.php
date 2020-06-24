<?php

namespace App\Http\Controllers;

use Auth;
use App\Post;
use App\User;
use Illuminate\Http\Request;
use App\Events\PostCreated;
use App\Events\PostModified;
use Illuminate\Support\Str;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::with('user')->orderBy('id', 'desc')->paginate(5);

        foreach($posts as $post){
            $post->body = (String) Str::of($post->body)->limit(150);
        }

        return response()->json([
            'posts' => $posts
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
        // broadcast(new PostCreated($createdPost, $request->user()))->toOthers();
        broadcast(new PostCreated($createdPost, $request->user()));


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
        $post = Post::with('user')->where('id', $id)->get();

        return response()->json([
            'post' => $post
        ]);
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
