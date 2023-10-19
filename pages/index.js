import Head from "next/head";
import Table from "../components/Table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Starwars Chart",
    },
  },
};

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [mass, setMass] = useState([]);
  const [height, setHeight] = useState([]);
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [added, setAdded] = useState([]);
  const {
    register,
    handleSubmit,
    // watch,
    reset,
    // formState: { errors },
    formState: { isSubmitting, isDirty, isValid }, // here
  } = useForm();

  function closeModal() {
    setIsOpen(false);
    reset({
      name: "",
      height: "",
      mass: "",
      hair_color: "",
      skin_color: "",
      isManual: true,
    });
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Mass",
        data: [...mass],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Height",
        data: [...height],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  useEffect(() => {
    const parsing = JSON.parse(localStorage.getItem(`chars_p${current}`));

    const storageCount = localStorage.getItem(`chars_count`);
    if (storageCount) setCount(storageCount);

    if (!parsing) {
      setIsLoading(true);
      axios({
        method: "get",
        url: `https://swapi.dev/api/people/?page=${current}`,
      }).then(function (res) {
        let data = res.data.results;
        setCount(res.data.count);
        localStorage.setItem(`chars_count`, res.data.count);
        if (current === 1) {
          const addedFromStorage = JSON.parse(
            localStorage.getItem(`chars_manual`)
          );
          if (addedFromStorage) {
            data = [...addedFromStorage, ...data];
          }
        }
        localStorage.setItem(`chars_p${current}`, JSON.stringify(data));
        setCharacters(data);

        const _labels = [];
        const _mass = [];
        const _height = [];
        data.forEach((item) => {
          _labels.push(item.name);
          _mass.push(Number(item.mass));
          _height.push(Number(item.height));
        });
        setLabels(_labels);
        setMass(_mass);
        setHeight(_height);

        setIsLoading(false);
      });
    } else {
      let _data = [...parsing];
      if (current === 1) {
        const addedFromStorage = JSON.parse(
          localStorage.getItem(`chars_manual`)
        );
        if (addedFromStorage) {
          _data = [...addedFromStorage, ..._data];
        }
      }
      setCharacters(_data);

      const _labels = [];
      const _mass = [];
      const _height = [];
      _data.forEach((item) => {
        _labels.push(item.name);
        _mass.push(Number(item.mass));
        _height.push(Number(item.height));
      });
      setLabels(_labels);
      setMass(_mass);
      setHeight(_height);

      setIsLoading(false);
    }
  }, [current, added]);

  const handleCurrent = (curr) => {
    setCurrent(curr);
  };

  Modal.setAppElement("#__next");

  const onSubmit = (data) => {
    const _added = JSON.parse(localStorage.getItem(`chars_manual`));
    let newAdded = [];

    let _data = {};
    if (_added) {
      _data = {
        ...data,
        isManual: true,
        id: _added.length + 1,
      };
      newAdded = [_data, ..._added];
    } else {
      _data = {
        ...data,
        isManual: true,
        id: 1,
      };
    }
    newAdded = [_data, ..._added];

    setAdded(newAdded);
    localStorage.setItem(`chars_manual`, JSON.stringify(newAdded));

    if (current === 1) {
      const chars = [_data, ...characters];
      setCharacters([...chars]);

      const _labels = [];
      const _mass = [];
      const _height = [];
      chars.forEach((item) => {
        _labels.push(item.name);
        _mass.push(Number(item.mass));
        _height.push(Number(item.height));
      });
      setLabels(_labels);
      setMass(_mass);
      setHeight(_height);
    }

    reset({
      name: "",
      height: "",
      mass: "",
      hair_color: "",
      skin_color: "",
      isManual: true,
    });

    setIsOpen(false);
  };

  const deleteChar = (item) => {
    const _added = [...added];
    const restAdded = _added.filter((char) => item?.id !== char.id);
    setAdded(restAdded);
    localStorage.setItem(`chars_manual`, JSON.stringify(restAdded));
  };

  return (
    <div className="p-8 ">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Starwars characters" />
        <title>Starwars Characters</title>
      </Head>
      <div className="flex justify-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/500px-Star_Wars_Logo.svg.png"
          alt=""
          className="rounded-lg h-32"
        />
      </div>
      <p className="text-xl text-center mb-8">Starwars Characters</p>

      <div className="w-full flex justify-end mb-4">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          Add Character
        </button>
      </div>

      <Pagination current={current} setCurrent={handleCurrent} count={count} />

      {isLoading ? (
        <div className="w-full flex justify-center items-center p-8">
          <Spinner />
        </div>
      ) : (
        <>
          <Table data={characters} itemToDelete={deleteChar} />
          <Bar options={options} data={data} />
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <div className="w-full flex justify-end">
              <button onClick={closeModal}>X</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Name
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Name"
                  {...register("name", {
                    required: {
                      value: true,
                    },
                  })}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Height
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Height (cm)"
                  {...register("height", {
                    required: {
                      value: true,
                    },
                  })}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Mass
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Mass (kg)"
                  {...register("mass", {
                    required: {
                      value: true,
                    },
                  })}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Hair Color
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Hair color"
                  {...register("hair_color", {
                    required: {
                      value: true,
                    },
                  })}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Skin Color
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Skin color"
                  {...register("skin_color", {
                    required: {
                      value: true,
                    },
                  })}
                />
              </div>
              <div className="flex w-full justify-end">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={!isDirty || !isValid}
                >
                  Add
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
}
