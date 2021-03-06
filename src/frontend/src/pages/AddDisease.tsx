import { useState } from "react";

const axios = require('axios');

async function addDisease(nameDisease : string, sequenceDisease : string) {
    const response = await axios.post('https://backend-bonek-dna.herokuapp.com/add', {name: nameDisease, dna: sequenceDisease});
    return response.data;
}

async function getDiseases() {
    try {
        const response = await axios.get('https://backend-bonek-dna.herokuapp.com/get');
        return Array.from(response.data.names);
    } catch (error) {
        return [];
    }
}

const AddDisease = () => {
    document.title = "Add Disease | BONEK DNA Tester";
    
    const [dnaseq, setDnaseq] = useState('');

    const setDNAString = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = async ()=>{
                const file = reader.result;
                setDnaseq(file ? file.toString() : '');
            }
            reader.readAsText(e.target.files[0]);     
        }
    };

    async function addDiseaseInput(diseaseName : string, dnaSeq : string) {
        const diseases = await getDiseases();
        if (diseaseName !== "" && dnaSeq !== "") {
            if (diseases.includes(diseaseName) === false) {
                if (/^[AGCT]*$/.test(dnaSeq)) {
                    addDisease(diseaseName, dnaSeq);
                    alert("Disease successfully added to database!");
                } else {
                    alert("Error! Make sure DNA sequence only contains characters AGCT!");
                }
            } else {
                alert("Error! Disease name already exists!");
            }
        } else {
            alert("Error! Make sure to fill in both the disease name and DNA sequence!");
        }
    }

    return (
        <>
        <div className="h=[100vh] overflow-hidden">
        <div className="flex flex-col rounded-2xl bg-gray-800 shadow-md mx-64 my-10">
            <form onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                addDiseaseInput((document.getElementById("disease") as HTMLInputElement).value, dnaseq);
                (document.getElementById("disease") as HTMLInputElement).value = "";
                (document.getElementById("dnasequence") as HTMLInputElement).value = "";
                }} >
            <div className="flex flex-col my-12">
                <h1>Add Disease</h1>
            </div>
            <div className="flex flex-col lg:grid items-center">
                <div className="row-start-1">
                    <h3>Disease Name:</h3>
                    
                        <div className="mb-6 my-6 mx-64">
                        <input id="disease" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Disease Name..." required/>
                        </div>
                    
                </div>
                <div className="row-start-2">
                    <h3>DNA Sequence:</h3>
                        <div className="mb-6 my-6 mx-64">
                        <input id="dnasequence" type="file" className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 p-2.5 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required onChange={setDNAString}/>
                        </div>
                </div>
            </div>
            <div className="flex flex-col lg:grid grid-cols-1 items-center">
                <div className="mt-8 mb-16">
                    <button type="submit" className="bg-gradient-to-br w-min from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-28 py-2.5 text-center">Submit</button>
                </div>
            </div>
            </form>
        </div>
        </div>
        </>
    );
};

export default AddDisease;