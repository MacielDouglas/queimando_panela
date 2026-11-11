import type { Metadata } from 'next';

import {
  LegalCallout,
  LegalContact,
  LegalSection,
  LegalSteps,
} from '@/components/legal/legal-blocks';
import { LegalDocumentShell } from '@/components/legal/legal-document-shell';

export const metadata: Metadata = {
  title: 'Termos de uso',
  description:
    'As regras de uso do Queimando Panela: conta, publicação de receitas, direitos autorais, uso da IA, moderação e responsabilidades.',
  alternates: {
    canonical: '/termos',
  },
  openGraph: {
    title: 'Termos de uso — Queimando Panela',
    description:
      'O acordo de cozinha entre você e o Queimando Panela: o que publicar, como a IA ajuda e quais são as responsabilidades.',
    type: 'article',
  },
};

const toc = [
  { id: 'quem-somos', label: 'Quem somos e o que este documento cobre' },
  { id: 'conta', label: 'Para usar, é preciso ter conta' },
  { id: 'como-usar', label: 'Como usar (o modo prático)' },
  { id: 'suas-receitas', label: 'Suas receitas continuam suas' },
  { id: 'nao-permitido', label: 'O que não vale fazer' },
  { id: 'ia', label: 'A IA é co-piloto — e pode errar' },
  { id: 'moderacao', label: 'Moderação e conteúdo de terceiros' },
  { id: 'disponibilidade', label: 'Disponibilidade, mudanças e encerramento' },
  { id: 'propriedade-intelectual', label: 'Propriedade intelectual do site' },
  { id: 'responsabilidade', label: 'Limites de responsabilidade' },
  { id: 'legislacao-contato', label: 'Legislação, foro e contato' },
];

export default function TermosPage() {
  return (
    <LegalDocumentShell
      documentLabel="Termos de uso"
      title="Termos de uso"
      dek="O acordo de cozinha entre você e o Queimando Panela: o que você pode publicar, como a IA ajuda e quais são as responsabilidades de cada lado."
      version="1.0"
      updatedAt="11 de novembro de 2026"
      readingTime="9 minutos"
      summary={[
        {
          label: 'Você é dono',
          text: 'As receitas que você publica continuam suas. O site recebe apenas uma licença para exibir e distribuir o conteúdo.',
        },
        {
          label: 'A IA não decide',
          text: 'Ela organiza, corrige e sugere. Revisar, testar e publicar continua sendo uma decisão humana.',
        },
        {
          label: 'Uso justo',
          text: 'Sem plágio, spam, ataques ou conteúdo ilegal. O que violar estas regras pode sair do ar.',
        },
      ]}
      toc={toc}
      otherDocument={{
        href: '/privacidade',
        label: 'Política de privacidade',
        description:
          'O que a gente guarda, por quê, por quanto tempo e como você pede acesso ou exclusão.',
      }}
    >
      <LegalSection
        id="quem-somos"
        index="01"
        title="Quem somos e o que este documento cobre"
      >
        <p>
          O <strong>Queimando Panela</strong> é um blog e uma comunidade para
          cozinheiros amadores. O site é mantido por{' '}
          <strong>Douglas Maciel</strong> e pode ser contatado pelo e-mail{' '}
          <a href="mailto:contato@queimandopanela.com.br">
            contato@queimandopanela.com.br
          </a>
          .
        </p>
        <p>
          Estes termos valem para o site, para a criação de conta, para a
          publicação e edição de receitas, para os recursos de inteligência
          artificial (como a análise de receita e o &quot;O que tem?&quot;) e
          para comentários e avaliações, quando estiverem disponíveis.
        </p>
        <p>
          Ao criar uma conta, publicar uma receita ou usar qualquer recurso,
          você confirma que leu e concorda com estas regras e com a{' '}
          <a href="/privacidade">Política de privacidade</a>. Se não concordar,
          não use o site. Nada aqui reduz direitos que a legislação brasileira
          garante a você.
        </p>
      </LegalSection>

      <LegalSection
        id="conta"
        index="02"
        title="Para usar, é preciso ter conta"
      >
        <p>
          O Queimando Panela é destinado a <strong>maiores de 18 anos</strong>.
          Se identificarmos uma conta de pessoa menor de idade, ela poderá ser
          encerrada. O responsável legal pode falar com a gente pelo e-mail de
          contato.
        </p>
        <ul>
          <li>
            Informe dados verdadeiros e mantenha seu e-mail atualizado. É por
            ele que avisos de segurança e de conta chegam.
          </li>
          <li>
            A senha é pessoal e intransferível. Não compartilhe a conta, não
            venda o acesso e avise imediatamente se suspeitar de uso indevido.
          </li>
          <li>
            Você é responsável pelas ações feitas com a sua conta enquanto elas
            não forem comunicadas como suspeitas.
          </li>
          <li>
            O login com Google é opcional e também está sujeito às regras do
            Google. Se você usar esse recurso, receberemos apenas os dados
            necessários para criar e autenticar sua conta.
          </li>
          <li>
            Podemos suspender ou encerrar contas para proteger o site, cumprir a
            lei ou interromper violações destes termos. Sempre que possível,
            explicamos o motivo e damos chance de correção.
          </li>
        </ul>
        <p>
          Você pode pedir o encerramento da conta a qualquer momento pelo e-mail
          de contato. O prazo e o que acontece com os dados estão detalhados na{' '}
          <a href="/privacidade">Política de privacidade</a>.
        </p>
      </LegalSection>

      <LegalSection
        id="como-usar"
        index="03"
        title="Como usar (o modo prático)"
      >
        <p>
          A ideia é simples: escreva como você faz na sua cozinha, deixe a IA
          organizar e publique depois de revisar. O caminho completo é este:
        </p>

        <LegalSteps
          steps={[
            {
              title: 'Crie sua conta ou entre',
              body: (
                <>
                  Cadastre-se com e-mail e senha ou use o login com Google. Sua
                  conta guarda suas receitas, rascunhos e dados de autoria.
                </>
              ),
            },
            {
              title: 'Escreva a receita do seu jeito',
              body: (
                <>
                  Informe título, ingredientes e modo de preparo. História,
                  fotos, tempo, porções e observações são opcionais, mas ajudam
                  quem vai cozinhar.
                </>
              ),
            },
            {
              title: 'Deixe a IA conferir',
              body: (
                <>
                  A análise sugere utensílios, tempo, classificação e estimativa
                  nutricional, além de corrigir clareza e medidas. Tudo entra
                  como rascunho editável.
                </>
              ),
            },
            {
              title: 'Revise com os olhos de quem cozinha',
              body: (
                <>
                  Confira medidas, temperaturas, ponto de cozimento, alergênicos
                  e substituições. Se algo não faz sentido na panela, ajuste
                  antes de publicar.
                </>
              ),
            },
            {
              title: 'Publique',
              body: (
                <>
                  Receitas publicadas ficam visíveis para qualquer pessoa, podem
                  ser compartilhadas e indexadas por buscadores. Revise o texto
                  e as imagens antes de tornar tudo público.
                </>
              ),
            },
            {
              title: 'Edite ou remova quando quiser',
              body: (
                <>
                  Na página da receita, o autor vê as opções de editar e
                  excluir. Buscadores e serviços de cache podem levar algum
                  tempo para refletir a remoção.
                </>
              ),
            },
          ]}
        />

        <h3>No recurso &quot;O que tem?&quot;</h3>
        <p>
          Você informa até 30 ingredientes e escolhe doce, salgado ou tanto faz.
          A IA pode fazer até duas perguntas antes de sugerir uma receita. O
          limite é de <strong>3 criações a cada 24 horas por conta</strong>. Os
          ingredientes digitados não são armazenados; ficam registrados apenas a
          conta, o IP e a data da geração, para controle de abuso.
        </p>
        <p>
          As receitas sugeridas pela IA são ponto de partida. Teste, ajuste e
          assuma a decisão final sobre o que vai para a mesa.
        </p>

        <LegalCallout title="Regra de ouro" tone="note">
          <p>
            Se você não serviria esse texto ou essa foto na cozinha de um amigo,
            não publique. O Queimando Panela é uma comunidade, não um depósito
            de conteúdo.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection
        id="suas-receitas"
        index="04"
        title="Suas receitas continuam suas"
      >
        <p>
          <strong>Você mantém a titularidade</strong> das receitas, histórias,
          fotos e demais conteúdos que publicar. Nada nestes termos transfere
          seus direitos autorais para o site.
        </p>
        <p>
          Para que o site funcione, você concede ao Queimando Panela uma licença{' '}
          <strong>não exclusiva</strong>, gratuita, mundial e válida enquanto o
          conteúdo estiver publicado, para armazenar, reproduzir, exibir,
          formatar, distribuir e divulgar esse conteúdo no site e em canais
          próprios de divulgação. Essa licença existe apenas para operar e
          apresentar a comunidade, e pode ser sublicenciada somente para
          prestadores técnicos necessários (como hospedagem e armazenamento de
          imagens).
        </p>
        <ul>
          <li>
            A licença termina quando você remove o conteúdo, ressalvadas cópias
            técnicas temporárias, caches e obrigações legais.
          </li>
          <li>
            Você pode editar ou excluir suas receitas a qualquer momento. A
            exclusão da conta remove suas receitas e imagens do site.
          </li>
          <li>
            Ao publicar, você declara que criou o conteúdo ou tem autorização
            para usá-lo. Inspirações devem ser creditadas; cópia integral sem
            permissão não é permitida.
          </li>
          <li>
            Fotos precisam ser suas ou ter autorização de quem as tirou. Pessoas
            identificáveis precisam concordar com a publicação; imagens de
            crianças só podem ser publicadas pelo responsável legal.
          </li>
          <li>
            Não envie documentos, placas, recibos, endereços ou qualquer dado
            pessoal nas imagens. Elas podem ficar públicas.
          </li>
          <li>
            O nome do autor aparece junto da receita. Seu e-mail e seus dados de
            conta não são exibidos publicamente.
          </li>
        </ul>
        <p>
          Você preserva seus direitos morais de autoria. O site não vende suas
          receitas, não as licencia para terceiros e não usa seu conteúdo para
          treinar modelos de inteligência artificial.
        </p>
      </LegalSection>

      <LegalSection id="nao-permitido" index="05" title="O que não vale fazer">
        <p>
          Para manter a cozinha segura e acolhedora, não é permitido usar o site
          para:
        </p>
        <ul>
          <li>
            Violar leis, direitos de terceiros, direitos autorais, privacidade
            ou a ordem pública.
          </li>
          <li>
            Publicar discurso de ódio, ameaça, assédio, discriminação, violência
            ou conteúdo sexual envolvendo menores.
          </li>
          <li>
            Copiar receitas, textos ou imagens sem autorização, se passar por
            outra pessoa ou criar perfil falso.
          </li>
          <li>
            Divulgar curas milagrosas, promessas de saúde sem base ou instruções
            que coloquem alguém em risco.
          </li>
          <li>
            Fazer spam, propaganda enganosa, esquema de pirâmide, phishing ou
            divulgar afiliados sem deixar claro que há interesse comercial.
          </li>
          <li>
            Enviar vírus, tentar acessar contas alheias, burlar autenticação,
            limites de uso ou mecanismos de segurança.
          </li>
          <li>
            Fazer raspagem massiva, sobrecarregar a infraestrutura, copiar o
            site ou tentar engenharia reversa sem autorização.
          </li>
          <li>
            Publicar dados pessoais ou sensíveis de terceiros sem consentimento,
            incluindo alergias, condições de saúde, endereços e telefones.
          </li>
          <li>
            Manipular a IA para gerar conteúdo proibido, burlar limites ou
            contornar estas regras.
          </li>
        </ul>
        <p>
          Conteúdo e contas que violarem estas regras podem ser removidos,
          limitados ou encerrados, com aviso quando possível. Em casos graves,
          podemos agir imediatamente e comunicar as autoridades competentes.
        </p>
        <p>
          Encontrou algo irregular? Escreva para{' '}
          <a href="mailto:contato@queimandopanela.com.br">
            contato@queimandopanela.com.br
          </a>{' '}
          com o link e uma explicação. A gente analisa.
        </p>
      </LegalSection>

      <LegalSection id="ia" index="06" title="A IA é co-piloto — e pode errar">
        <p>
          A inteligência artificial do Queimando Panela organiza, corrige,
          classifica e sugere. Ela <strong>não substitui</strong> seu teste, seu
          paladar, um nutricionista ou um médico.
        </p>
        <p>
          Estimativas de tempo, porção, nutrientes e ponto de cozimento podem
          estar incompletas ou erradas. Temperaturas e tempos variam conforme
          equipamento, altitude, ingredientes e tamanho dos cortes. Alergênicos,
          contaminação cruzada e segurança alimentar exigem conferência própria,
          inclusive nas embalagens dos produtos.
        </p>
        <ul>
          <li>
            Não use a análise como diagnóstico, prescrição, dieta ou orientação
            médica.
          </li>
          <li>
            Se você tem alergia, restrição alimentar ou condição de saúde,
            confirme cada ingrediente e cada etapa com fontes confiáveis.
          </li>
          <li>
            A IA pode ficar indisponível, apresentar falhas ou gerar resultados
            repetidos. Não há garantia de disponibilidade contínua.
          </li>
          <li>
            O conteúdo enviado à IA é tratado conforme a{' '}
            <a href="/privacidade">Política de privacidade</a> e não é usado
            para treinar modelos.
          </li>
        </ul>

        <LegalCallout
          title="Receita é orientação, não prescrição"
          tone="warning"
        >
          <p>
            A decisão final sobre ingredientes, ponto de cozimento e o que serve
            à mesa é sempre sua. Em caso de dúvida sobre segurança alimentar,
            prefira não servir.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection
        id="moderacao"
        index="07"
        title="Moderação e conteúdo de terceiros"
      >
        <p>
          Podemos revisar, ajustar formatação, ocultar ou remover conteúdos que
          violem estes termos, a lei ou direitos de terceiros. Não temos
          obrigação de monitorar previamente tudo o que é publicado, mas agimos
          quando recebemos uma denúncia ou identificamos um problema.
        </p>
        <p>
          Cada autor responde pelo que publica. Opiniões em comentários, links
          externos e conteúdos de terceiros não representam o posicionamento do
          Queimando Panela. Ao acessar um link externo, você passa a seguir as
          regras daquele site.
        </p>
        <p>
          Se você é titular de direitos e acredita que algo publicado viola seus
          direitos, envie a identificação do conteúdo, a explicação e a prova de
          titularidade para o e-mail de contato. Vamos analisar e responder.
        </p>
      </LegalSection>

      <LegalSection
        id="disponibilidade"
        index="08"
        title="Disponibilidade, mudanças e encerramento"
      >
        <p>
          O site é gratuito e pode passar por manutenção, mudanças de recursos
          ou limitações temporárias. Não garantimos funcionamento ininterrupto
          nem que todo recurso estará disponível para sempre.
        </p>
        <p>
          Podemos criar, alterar ou descontinuar funcionalidades, bem como
          estabelecer limites de uso para proteger a comunidade e a
          infraestrutura. Quando a mudança afetar direitos relevantes,
          avisaremos com antecedência razoável.
        </p>
        <p>
          Você pode parar de usar o site quando quiser e pedir a exclusão da
          conta. Contas encerradas por violação podem ter o conteúdo removido.
        </p>
        <p>
          Estes termos podem ser atualizados. A versão vigente, com data e
          número, fica sempre nesta página. Mudanças materiais serão comunicadas
          no site ou por e-mail; o uso após a entrada em vigor indica
          concordância com a nova versão.
        </p>
      </LegalSection>

      <LegalSection
        id="propriedade-intelectual"
        index="09"
        title="Propriedade intelectual do site"
      >
        <p>
          A marca <strong>Queimando Panela</strong>, o nome, o logotipo, o
          layout, o código, os textos editoriais, as ilustrações e os elementos
          visuais do site pertencem ao projeto e a Douglas Maciel, salvo
          indicação em contrário.
        </p>
        <p>
          Você recebe uma licença limitada, pessoal e não comercial para navegar
          e usar o site. Não é permitido copiar, republicar, vender, licenciar
          ou explorar comercialmente esses elementos sem autorização escrita.
        </p>
        <p>
          As receitas e demais conteúdos publicados por usuários continuam
          pertencendo a seus autores, conforme a seção 04. O uso de conteúdo de
          terceiros depende da licença ou autorização aplicável.
        </p>
      </LegalSection>

      <LegalSection
        id="responsabilidade"
        index="10"
        title="Limites de responsabilidade"
      >
        <p>
          Na máxima extensão permitida pela lei brasileira, o Queimando Panela
          não garante que a IA esteja correta, que uma receita dê certo, que a
          estimativa nutricional seja exata ou que o site fique disponível sem
          interrupções.
        </p>
        <p>
          Não somos responsáveis por danos indiretos, lucros cessantes, perda de
          oportunidades, falhas de serviços de terceiros, uso indevido da conta
          ou decisões tomadas a partir de conteúdo publicado por usuários.
        </p>
        <p>
          Nada nestes termos exclui ou limita responsabilidades que não podem
          ser afastadas por lei, incluindo direitos do consumidor, dolo, culpa
          grave e obrigações legais. Você continua responsável pelo que publica
          e pelas decisões que toma na sua cozinha.
        </p>
        <p>
          Se você identificar um erro grave, uma receita perigosa ou um conteúdo
          que viole direitos, avise pelo e-mail de contato para que possamos
          corrigir ou remover.
        </p>
      </LegalSection>

      <LegalSection
        id="legislacao-contato"
        index="11"
        title="Legislação, foro e contato"
      >
        <p>
          Estes termos são regidos pelas leis brasileiras, incluindo a{' '}
          <strong>LGPD (Lei nº 13.709/2018)</strong>, o{' '}
          <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong> e o{' '}
          <strong>Código de Defesa do Consumidor</strong>, quando aplicável.
        </p>
        <p>
          Antes de qualquer medida judicial, a gente prefere conversar. Se não
          houver acordo, fica competente o foro previsto na lei brasileira —
          incluindo o domicílio do consumidor, quando a legislação assim
          garantir.
        </p>
        <p>
          Dúvidas sobre estes termos, denúncias de conteúdo e pedidos de
          exclusão podem ser enviados para o e-mail abaixo. Respondemos em até 5
          dias úteis. Pedidos de privacidade seguem o prazo legal de 15 dias e
          estão detalhados na <a href="/privacidade">Política de privacidade</a>
          .
        </p>

        <LegalContact
          title="Falar sobre os termos"
          note="Ao escrever, conte o que aconteceu, o link da receita ou da conta e como prefere ser respondido. Não envie senhas ou documentos por e-mail."
        >
          <p>
            Use o assunto <strong>&quot;Termos de uso&quot;</strong> para
            dúvidas, denúncias ou pedidos relacionados a este documento.
          </p>
        </LegalContact>

        <p>
          <strong>Versão 1.0</strong> — publicada em 11 de novembro de 2026.
          Substitui versões anteriores, se houver.
        </p>
      </LegalSection>
    </LegalDocumentShell>
  );
}
