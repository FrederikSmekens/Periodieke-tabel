import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { Element } from './modules/element.js';
"use strict";
let periodicTable
const divElementDetailsText = document.getElementById("element-details-text");
const divElementDetailsImage = document.getElementById("element-details-image");
let grid = document.getElementById("grid");

class PeriodicTable {
    #elements = [];
    constructor() {
    }
    getElements() {
        return this.#elements;
    }

    async getElementsFromJSON(url) {
        let oElement;
        let response = await fetch(url);

        if (response.ok) {
            let json = await response.json();

            for (const element of json.elements) {
                // console.log(element.summary);
                oElement = new Element(element.name, element.xpos, element.ypos, element.symbol, element.number, element["cpk-hex"], element.bohr_model_3d, element.summary, element.source, element.image);
                //console.log(oElement);
                this.#elements.push(oElement);
            }

        } else {
            alert("HTTP-Error: " + response.status);

        }

    }
    fillTable() {
        //console.log(this.#elements);
        //console.log(periodicTable)

        for (const element of this.#elements) {
            let obstakelDiv = document.createElement('div');
            obstakelDiv.addEventListener("click",
                function () {
                    periodicTable.clickElement(element, obstakelDiv)
                });
            obstakelDiv.setAttribute("class", "element");
            obstakelDiv.innerHTML = `<span class="element__number">${element.getNumber()}<span>`;
            obstakelDiv.innerHTML += `<span class="element__symbol">${element.getSymbol()}<span>`;
            obstakelDiv.setAttribute("style", `grid-column-start: ${element.getXPos()}; grid-row-start: ${element.getYPos()}; background-color: #${element.getBgColor()}`)
            grid.appendChild(obstakelDiv);
        }
    }

    clickElement(element, obstakelDiv) {
        console.log(element.getSymbol());

        divElementDetailsText.innerHTML = "<h2 class='element-details__title'>What element is this?</h2>";
        divElementDetailsImage.innerHTML = `<figure><img src="${element.getImage().url}" alt="${element.getName()}"></figure>`;

        let guess = document.createElement("input");
        guess.setAttribute("type", "text");
        let btnGuess = document.createElement("button");
        btnGuess.innerHTML = "Submit";
        btnGuess.setAttribute("type", "submit");

        divElementDetailsText.appendChild(guess);
        divElementDetailsText.appendChild(btnGuess);
        
        btnGuess.addEventListener("click",
            function () {
                periodicTable.guessElement(guess.value, element, obstakelDiv)
            }
        );

    }
    guessElement(guess, element, obstakelDiv) {
        console.log(guess);

        if (guess == element.getSymbol()) {
            divElementDetailsText.innerHTML = "";
            divElementDetailsImage.innerHTML = "";
            obstakelDiv.classList.add("show");

            divElementDetailsText.innerHTML += `<h2 class="element-details__title">${element.getName()}</h2>`;

            divElementDetailsText.innerHTML += `<p class="element-details__text">${element.getSummary()}<br>
            <span class="element-details__source">Source: <a href="${element.getSource()}" target="_blank" >${element.getSource()}</a></span></p>`;



            divElementDetailsText.innerHTML += `<details>
                                                <summary>See image</summary>
                                                    <figure>
                                                    <img src="${element.getImage().url}" alt="${element.getName()}">
                                                    <figcaption>
                                                    ${element.getImage().title}
                                                    source: ${element.getImage().attribution}
                                                    </figcaption>
                                                    </figure>
                                                </details>
                                                `
            if (element.getGLBFile()) {
                this.renderGLB(element.getGLBFile());
            }
        }
        else {
            divElementDetailsText.innerHTML = "<div class = 'alert alert--wrong'>Wrong!</div>";
        }
    }

    renderGLB(url) {

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(2, 400 / 200);

        let mesh;
        const controls = new OrbitControls(camera, renderer.domElement);

        renderer.setSize(400, 200);

        scene.add(new THREE.HemisphereLight(0xffffcc, 0x333399, 1.0));
        camera.position.set(-2, 2, 10);

        new GLTFLoader().load(url, ({ scene: model }, animations) => {
            scene.add(model);

            model.scale.setScalar(1.0);

            camera.lookAt(model.position);

            controls.target.copy(model.position);

            mesh = model;
        });

        const animate = () => {
            if (mesh) {
                mesh.rotateY(Math.PI / 360);
            }

            renderer.render(scene, camera);

            controls.update();

            requestAnimationFrame(animate);
        };

        animate();

        divElementDetailsImage.appendChild(renderer.domElement);

    }

}

periodicTable = new PeriodicTable();
await periodicTable.getElementsFromJSON("PeriodicTableJSON.json");
periodicTable.fillTable();





