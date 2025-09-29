
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useFetchApi from '../custom-hooks/FetchApi';
import { use } from 'react';

export default function Counter() {

    const [counter, setCounter] = useState({
        name: "shiva",
        location: {
            city: "lucknow",
            country: "India"
        },
        age: 21
    });

    const { data, error } = useFetchApi("https://api.restful-api.dev/objects");
    console.log("ye to data hai", data)


    console.log(counter);


    let arr = ["Red", "Blue", "Green"];

    useEffect(() => {
        // console.log(ans)
        console.log(data)
    }, [])




    function decrease() {
        // if (counter < 0) return
        // setCounter(counter - 1)

        setCounter({ ...counter, location: counter.location.city = "Hyderabad" })

        // setCounter((prev) =>  ({...prev , location:{ 
        //     ...prev.location,
        //     city:"Hyderabad"
        // } }));

        // console.log(counter)
    }

    console.log(counter)


    function increase() {
        // setCounter(counter + 1)

    }


    // useEffect(() => {
    //     // if(counter < 0){
    //     //     alert("Data should not be less than 0")
    //     // }

    //     console.log(counter)



    // }, [counter])




    // api  https://api.restful-api.dev/objects

    function handleApi() {

        // try {
        //     axios.get('https://api.restful-api.dev/objects')
        //         .then((res) => console.log(res))

        // } catch (error) {
        //     console.log(error)
        // }

    }

    // useEffect(() => {
    //     handleApi()
    // }, [])

    const [formField, setFormField] = useState(1)
    function handledynamicForm() {



    }



    // 
    const [phones, setPhones] = useState([""]); // start with one empty input

    // ✅ Handle change in specific input
    function handleChange(index, value) {
        const updatedPhones = [...phones];
        updatedPhones[index] = value;
        setPhones(updatedPhones);
    }

    // ✅ Add a new empty phone field
    function addPhone() {
        setPhones([...phones, ""]);
    }

    // ✅ Remove a phone field by index
    function removePhone(index) {
        const updatedPhones = phones.filter((_, i) => i !== index);
        setPhones(updatedPhones);
    }

    // ✅ Handle form submit
    function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitted Phones:", phones);
        alert("Submitted: " + phones.join(", "));
    }


    const [morefield, setMore] = useState([""]);

    function handleAddMore() {
        setMore([...morefield, ""])

    }

    const [items, setItems] = useState([
        "🍎 Apple",
        "🍌 Banana",
        "🍇 Grapes",
        "🍊 Orange",
        "🍍 Pineapple",
    ]);

    const [dragIndex, setDragIndex] = useState(null);

    function handleDragStart(index) {
        setDragIndex(index)
        console.log(index)
    }

    function handleDragOver(e) {
        e.preventDefault()
    }

    function handleDrop(index) {
        if (dragIndex === null) return;
        const updatedItem = [...items];

        const [dragedItem] = updatedItem.splice(dragIndex, 1)
        updatedItem.splice(index, 0, dragedItem);

        setItems(updatedItem)
        setDragIndex(null)

    
    }


    return (
        <div>
            <div className='flex justify-center  p-8 ' >
                <button onClick={decrease} className='bg-blue-300 px-5 py-2 rounded-2xl'  >-</button>
                {/* <p className='m-4 '>{counter}</p> */}
                <button onClick={increase} className='bg-blue-300 px-5 py-2 rounded-2xl'>+</button>
            </div>

            <div  >
                {
                    arr.map((item, i) => {
                        return <>
                            <button className={`${item == "Red" ? "bg-red-400" : (item == "Blue" ? "bg-blue-400" : "bg-green-300")}  px-5 py-2 m-8 rounded-2xl text-white`} >{item}</button >
                        </>
                    })
                }
            </div>


            <div>
                <button onClick={handleApi} ></button>
            </div>


            <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Dynamic Phone Form</h1>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {phones.map((phone, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder={`Phone ${index + 1}`}
                                value={phone}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 flex-1"
                            />
                            {phones.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePhone(index)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addPhone}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                    >
                        + Add Phone
                    </button>

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                    >
                        Submit
                    </button>
                </form>
            </div>


            <div>
                <form >

                    {
                        morefield.map((item, i) => {
                            return <>
                                <input onChange={(e) => { set }} className='bg-pink-500 border-2 border-red-300 rounded-3xl m-2' placeholder='add phone no' type="text" />
                            </>
                        })
                    }

                </form>

                <button onClick={handleAddMore}>AddMore</button>
            </div>


            {/* Dragable component */}

            <div>
                {
                    items.map((item, i) => {
                        return <>
                            <ul>
                                <li key={item}
                                    draggable
                                    onDragStart={() => handleDragStart(i)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(i)}
                                >
                                    {item}
                                </li>
                            </ul>
                        </>
                    })
                }
            </div>

        </div >
    )
}
