apps : Applicación core-expendiente-pas

core-expendiente-pas


Dominio => Agrupación de cosas relacionadas entre si.

osu => Organo de Sustento
ifis => Sabrá Dios
sarefis => x2


Cada dominio tiene:
- feature => Las funcionalidades que están dentro de un dominio
    - CRUD medicos
    - Agengar cita a un médico.

- ui => Componentes UI, generalmente presentacionales.
    card
    table
    text
    input
    show-available-doctor

- data-acess => Acceso a la información, servicios, fetchs, https, stores, constantes, models, interfaces, etc
    doctor.service.ts
    doctor.store.ts

- utils => Cosas que se reusarán como utilitarios, como funciones, configuraciones, etc
    -utils.ts //generateID(), computeCurrentUser()
    -functions.ts
    -shared.ts



core-expendiente-pas
-- apps
    core

-- libs
     --- osu // Cada dominio es una librería.
         -features:
            -- agregar-algo
                -ui
                -data-access
                -utils
