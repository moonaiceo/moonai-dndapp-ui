'use script';

import { CosmWasmClient, SigningCosmWasmClient  } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

const btnConnect = document.querySelector(".btn_connect");
const btnKeplr = document.querySelector(".modal__body-item");

let btnMint = $('.mint__app__btn');

let isUserConnected = false;
let offlineSigner;
let account;

const network = "testnet";
const chainId = {
  "mainnet": "osmosis-1",
  "testnet": "osmo-test-4",
};

document.querySelector(".mint__app__btn").addEventListener("click", () => {
    if (isUserConnected === false) {
        $('.overlay').fadeIn('slow');
        $('.menu').fadeOut('slow');
        $('.modal').fadeIn('slow');
        $("html").css("overflow", "hidden");
    }
});

btnKeplr.addEventListener("click", () => connectKeplr());
btnConnect.addEventListener("click", () => disconnectWallet());

async function connectKeplr() {
  
    if (!window.keplr) {
        alert("Please install keplr extension");
        // Enabling before using the Keplr is recommended.
        // This method will ask the user whether to allow access if they haven't visited this website.
        // Also, it will request that the user unlock the wallet if the wallet is locked.
    }
    else {
        await window.keplr.enable(chainId[network]);

        offlineSigner = window.keplr.getOfflineSigner(chainId[network]);
        console.log(offlineSigner);
    
        // You can get the address/public keys by `getAccounts` method.
        // It can return the array of address/public key.
        // But, currently, Keplr extension manages only one address/public key pair.
        // XXX: This line is needed to set the sender address for SigningCosmosClient.
        const accounts = await offlineSigner.getAccounts();

        // const transaction = await sendTx(chainId[network], accounts[0].pubkey, "sync");
        // console.log(transaction);

        account = accounts[0];
        
        console.log(accounts[0]);
        btnConnect.innerHTML = "Disconnect";
        btnConnect.classList.add('btn_connect_signed');
        localStorage.setItem('isLoggedIn', true);
        isUserConnected = true;
        changeBtn();
        $('.overlay, .modal').fadeOut('slow');
        $('.menu').fadeIn('slow');
        $('html').css("overflow", "overlay");
        $(".mint__app__btn").text($(".mint__app__change-state_active").text());
    //   get_count();
    //   await show_user_related_elements();

        // Initialize the gaia api with the offline signer that is injected by Keplr extension.
        // const cosmJS = new SigningCosmosClient(
        //     // "https://lcd-osmosis.keplr.app/rest",
        //     "https://rest.sentry-01.theta-testnet.polypore.xyz",
        //     accounts[0].address,
        //     offlineSigner
        // );

    }
    
}

function disconnectWallet() {
    if (isUserConnected) {
        // $(".btn__connect").toggle();
        // $(".btn__connect_signed").on("click", () => disconnectWallet());
        
        window.keplr.disable(chainId[network]);
        btnConnect.innerHTML = "Connect wallet";
        btnConnect.classList.remove('btn_connect_signed');
        localStorage.setItem('isLoggedIn', false);
        isUserConnected = false;
        // hide_user_related_elements();
        
        // hideHeaderButtonMenu();
        changeBtn();
        $(btnMint).text("CONNECT");
    }
  }

// Modal

$('.btn_connect').on('click', function() {
    $('.overlay').fadeIn('slow');
    $('.menu').fadeOut('slow');
    $('.modal').fadeIn('slow');
    $("html").css("overflow", "hidden");
});

$('.overlay').on('click', function(e) {
    if ($('.overlay, .modal').is(":visible")) {
      if (e.target === this) {
        $('.overlay, .modal').fadeOut('slow');
        $('.menu').fadeIn('slow');
        $('html').css("overflow", "overlay");
      }
    }
});

$('.modal__close').on('click', function() {
    $('.overlay, .modal').fadeOut('slow');
    $('.menu').fadeIn('slow');
    $('html').css("overflow", "overlay");
});

// Redeem

$('.mint__app__change-state').on('click', function() {
    $(this)
        .addClass('mint__app__change-state_active').siblings().removeClass('mint__app__change-state_active');
    if ($(this).text() === 'REDEEM') {
        $(this).closest('div.mint__app').find('div.mint__app__redeem').addClass('mint__app__redeem_active');
    }
    else {
        $(this).closest('div.mint__app').find('div.mint__app__redeem').removeClass('mint__app__redeem_active');
    }
    if (isUserConnected) {
        $(".mint__app__btn").text($(".mint__app__change-state_active").text());
    }
});

// Radiobuttons

$('.mint__app__redeem-wrapper__radio').on('click', function() {
    $(this)
        .addClass('mint__app__redeem-wrapper__radio_active').siblings().removeClass('mint__app__redeem-wrapper__radio_active')
        .find('img.mint__app__redeem-wrapper__radio-img').removeClass('mint__app__redeem-wrapper__radio-img_active')
        .closest('div.mint__app__redeem').find('ul.mint__app__redeem-list').removeClass('mint__app__redeem-list_active').eq($(this).index()).addClass('mint__app__redeem-list_active');
    $(this)    
        .find('img.mint__app__redeem-wrapper__radio-img').addClass('mint__app__redeem-wrapper__radio-img_active');
    if ($(this).find('div.mint__app__redeem-wrapper__radio-text').text() == "Instant redeem")
        $('.mint__app__info-item').find('div.mint__app__info-item__descr').eq(1).text("5%");
    else
        $('.mint__app__info-item').find('div.mint__app__info-item__descr').eq(1).text("-");
});

// Button

const changeBtn = () => {
    if (isUserConnected) {
        $(btnMint).addClass('mint__app__btn_active');
    }
    else if (isUserConnected === false) {
        btnMint.removeClass('mint__app__btn_active');
    } 
}

// Inputs

// $('input[type=number]').eq(0).keyup(function() {
//     $('input[type=number]').eq(1).val($('input[type=number]').eq(0).val() * 1.5);
// });

// $('input[type=number]').eq(1).keyup(function() {
//     $('input[type=number]').eq(0).val($('input[type=number]').eq(1).val() / 1.5);
// });

$('input[type=number]').eq(1).keyup(function() {
    $('input[type=number]').eq(0).val($('input[type=number]').eq(1).val());
});

$('input[type=number]').eq(0).keyup(function() {
    $('input[type=number]').eq(1).val($('input[type=number]').eq(0).val());
});