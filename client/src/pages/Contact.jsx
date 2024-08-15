import { GiCoffeeCup } from "react-icons/gi";
import maciel from "../assets/maciel_d.png";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className=" bg-gray-300 font-noto">
      <div className="py-20 px-4 max-w-6xl mx-auto mb-32 ">
        <h1 className="text-3xl text-center font-bold mb-8 text-gray-800 ">
          Obrigado por visitar{" "}
          <span className="font-oswald">Queimando Panela</span>
        </h1>
        <div className="text-xl flex flex-col gap-6 text-gray-600">
          <p>
            Meu nome é<span className="font-bold"> Douglas Maciel</span>
          </p>
          <p>
            Sou desenvolvedor <span className="font-semibold">Full-Stack</span>{" "}
            apaixonado pela criação de soluções digitais inovadoras que
            impulsionam o sucesso dos negócios e melhoram a experiência do
            usuário. Com quatro anos de experiência na área, venho aprimorando
            minhas habilidades em uma ampla gama de tecnologias e me destacando
            tanto no desenvolvimento de front-end quanto de back-end.
          </p>
          <p>
            No <span className="font-semibold">Front-End</span>, sou
            especialista em HTML, CSS e JavaScript, criando interfaces web
            elegantes e responsivas que proporcionam uma experiência de usuário
            envolvente. Além disso, domino frameworks como{" "}
            <span className="font-semibold">React e Vite</span>, utilizando-os
            para desenvolver aplicações web dinâmicas e interativas.
          </p>

          <p>
            No <span className="font-semibold">Back-End</span>, sou proficiente
            em <span className="font-semibold">Node.js</span>, uma ferramenta
            poderosa que me permite construir servidores eficientes e
            escaláveis. Minha experiência se estende ao uso de bancos de dados
            como <span className="font-semibold">MongoDB</span>, garantindo que
            as aplicações que desenvolvo tenham uma base sólida para armazenar e
            gerenciar dados de forma eficaz. Além disso, possuo conhecimento em{" "}
            <span className="font-semibold">GraphQL</span>, uma tecnologia que
            admiro por sua capacidade de simplificar o processo de consulta e
            manipulação de dados em aplicações web.
          </p>

          <p>
            Sou <span className="font-semibold">fluente em espanhol</span> e
            tenho conhecimentos{" "}
            <span className="font-semibold">básicos de inglês</span> , o que me
            permite colaborar eficazmente em equipes multiculturais e
            comunicar-me com clientes ao redor do mundo.
          </p>

          <p>
            Antes de me aventurar no mundo da tecnologia, passei duas décadas
            como representante comercial na indústria automotiva. Essa
            experiência me proporcionou uma compreensão profunda das
            necessidades do cliente, além de habilidades valiosas em comunicação
            e negociação.
          </p>
          <p className="flex  gap-3 items-baseline">
            Tudo isso com muito café!!! <GiCoffeeCup className="text-2xl" />
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-20 flex gap-10">
        <div className=" w-1/2 flex flex-col items-center p-10 gap-24">
          <h2 className="text-4xl text-gray-300 ">Acesse meu portfólio.</h2>
          <p className="text-gray-500 text-xl">
            Contacte-me para iniciar seu projeto de desenvolvimento web, farei
            que se torne realidade!!!
          </p>
        </div>
        <Link
          className="w-1/2"
          to="https://macield.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="object-cover hover:scale-105 transition-transform duration-500 ease-in-out "
            src={maciel}
            alt="Imagem do site Maciel D."
          />
        </Link>
      </div>
    </div>
  );
}
