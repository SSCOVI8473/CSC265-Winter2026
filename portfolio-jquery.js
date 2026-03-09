/*
Author: Steven Scoville
Date:   03/08/2026
File:   portfolio-jquery.js
Assignment: CSC265 - Assignment 9.3 (jQuery Portfolio Enhancements)

Description:
Adds three jQuery enhancements to the portfolio pages:
1. Dark/Light theme toggle (index only for now)
2. Active navigation link highlighting
3. Back-to-top button with smooth scrolling
*/

$(function () {

    // Modification 1: Theme toggle

    $("#themeToggle").click(function () {

        if ($("body").hasClass("theme-dark")) {
            $("body")
            .removeClass("theme-dark")
            .addClass("theme-light");

            $("#themeToggle").text("Switch to Dark Theme");
        }
        else {
            $("body")
            .removeClass("theme-light")
            .addClass("theme-dark");

            $("#themeToggle").text("Switch to Light Theme");
        }

    });


    // Set the correct button label when page initially loads
    if ($("body").hasClass("theme-dark")) {
        $("#themeToggle").text("Switch to Light Theme");
    }
    else {
        $("#themeToggle").text("Switch to Dark Theme");
    }



    // Modification 2: Navigation active-link highlight

    $(".nav-link").click(function () {

        $(".nav-link").removeClass("active");

        $(this).addClass("active");

    });



    // Modification 3: Back-to-top button

    $(window).scroll(function () {

        if ($(this).scrollTop() > 200) {
            $("#backToTop").fadeIn();
        }
        else {
            $("#backToTop").fadeOut();
        }

    });


    $("#backToTop").click(function () {

        $(".nav-link").removeClass("active");

        $("html, body").animate(
            { scrollTop: 0 },
            600
        );

    });

});