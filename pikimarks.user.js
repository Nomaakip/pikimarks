// ==UserScript==
// @name pikimarks
// @namespace https://github.com/ozgq
// @version 2024-12-23
// @description Bookmarks. To pikidiary. Doesn't really do much else.
// @author zav
// @match https://pikidiary.lol/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=pikidiary.lol
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("its working its magic bro u could wait..");
    // feel the chaos in the crib get it how you live
    const sidebar = document.querySelector(".bar-cont");
    const bar = document.createElement("div")
    var text = document.createTextNode("Bookmarks");
    bar.className = "bar";
    sidebar.appendChild(bar);
    bar.appendChild(text);
    var fav = JSON.parse(localStorage.getItem('favorites') || "[]");
    for (let o = 0; o < fav.length; o++) {
        const link = document.createElement("a");
        link.href = `https://pikidiary.lol/posts/${fav[o]}`;
        link.textContent = fav[o];
        bar.appendChild(link);
    }

    function bookmark(likeForm) {
        const link = document.createElement("a");
        const text = document.createTextNode("bookmark");
        const postId = likeForm.dataset.postId;
        var localfavs = JSON.parse(localStorage.getItem('favorites') || "[]");
        link.appendChild(text);
        link.onclick = function () {
            favorite(postId, link);
        };
        for (let o = 0; o < localfavs.length; o++) {
            if (postId == localfavs[o]) {
                link.textContent = "bookmarked";
            }
        }
        likeForm.after(link);
    }

    function favorite(post, clicked) {
        var localfavs = JSON.parse(localStorage.getItem('favorites') || "[]");
        const index = localfavs.indexOf(post);

        if (index > -1) {
            localfavs.splice(index, 1);
            console.log("unfavorited");
            clicked.textContent = "bookmark";
        } else {
            localfavs.push(post);
            console.log("favorited");
            clicked.textContent = "bookmarked";
        }
        localStorage.setItem('favorites', JSON.stringify(localfavs));
    };
// for mutationobserver i was so confused so this implementation is written by google gemini. soary.
    document.addEventListener('DOMContentLoaded', () => {
        if (!localStorage.favorites) {
            localStorage.setItem('favorites', JSON.stringify([]));
        }

        const initialLikeForms = document.querySelectorAll('.like-form');
        initialLikeForms.forEach(bookmark);

        // Set up Mutation Observer to watch for dynamically added like-forms
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Ensure it's an element
                        if (node.classList.contains('like-form')) {
                            bookmark(node);
                        } else {
                            const likeForms = node.querySelectorAll('.like-form');
                            likeForms.forEach(bookmark);
                        }
                    }
                });
            }
        });

        // observe specified container ...
        observer.observe(document.querySelector(".tab-contents"), {
            childList: true,
            subtree: true
        });
    });
})();
