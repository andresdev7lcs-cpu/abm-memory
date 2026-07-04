import { Question } from "@/types";

export const questions: Question[] = [
  {
    id: 1,
    text: "¿Cuál es el salario mínimo en California en 2026?",
    options: ["$13.50", "$15.00", "$16.50", "$16.90"],
    correctIndex: 3,
  },
  {
    id: 2,
    text: '¿Qué gasto olvidan la mayoría cuando "hacen cuentas"?',
    options: ["Transporte", "Apps y suscripciones digitales", "Renta", "Supermercado"],
    correctIndex: 1,
  },
  {
    id: 3,
    text: '¿Qué porcentaje dice "me alcanza" pero no ahorra nada?',
    options: ["20%", "35%", "50%", "70%"],
    correctIndex: 3,
  },
  {
    id: 4,
    text: "Si alguien recibe $10,000 inesperados, ¿qué hace la mayoría?",
    options: ["Los invierte", "Los guarda", "Los gasta en gustos y deudas", "Los dona"],
    correctIndex: 2,
  },
  {
    id: 5,
    text: "¿Cuál es la lotería más popular en EE.UU.?",
    options: ["Lucky Day", "Mega Millions", "Cash Gold", "Power Pick"],
    correctIndex: 1,
  },
  {
    id: 6,
    text: "En promedio, ¿cuántas tarjetas de crédito tiene un adulto en EE.UU.?",
    options: ["1", "2", "3", "4+"],
    correctIndex: 3,
  },
  {
    id: 7,
    text: "¿Cuántas personas saben cuánto pagan en intereses al año?",
    options: ["La mayoría", "La mitad", "Muy pocas", "Casi todas"],
    correctIndex: 2,
  },
  {
    id: 8,
    text: "¿Cuál es el hábito más común del 1% financieramente organizado?",
    options: ["Revisar números mensualmente", "No usar tarjetas", "Apostar en bolsa", "Guardar efectivo en casa"],
    correctIndex: 0,
  },
  {
    id: 9,
    text: "Si hoy pierdes tu empleo, ¿qué diferencia a alguien preparado?",
    options: ["Pide préstamo", "Tiene plan financiero claro", "Se endeuda", "Espera ayuda"],
    correctIndex: 1,
  },
  {
    id: 10,
    text: "¿Qué diferencia a quienes logran independencia financiera?",
    options: ["Ganan más dinero", "Son más inteligentes", "Tienen un sistema claro y disciplinado", "Tienen suerte"],
    correctIndex: 2,
  },
];
