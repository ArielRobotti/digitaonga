module {

  let reactions = [
    "👍", "👎", "👏", "🙏", "✊", "🙌", "❤️", "🤝", "💯", "⚖️", "📜", "😂", "😢", "🔥", "😍", "🤔", "😎", "🎉", "🤯", "😏",
    "🕊️", "🌍", "🫶", "😮", "👀", "😡", "📢", "🌱", "🧑‍🤝‍🧑", "🤗", "💬", "🕯️", "🏳️", "🤝🏽", "🤝", "🚀", "😭", "🤩", "💔", "🫶"
  ];

  public func getReactions() : [Text] {
    reactions
  };


  public type NotificationContext = {
    root : Int;   // ID del elemento principal (Ej: Proposal Id, Post Id, etc.)
    path : [Int]; // Ruta jerárquica hasta el subelemento específico (Ej: comentario, subcomentario ID)
    senderName : Text;
};

  public type NotificationKind = {
    #ReactComment : NotificationContext and { // Notificacion a usuarios especificos
      reaction : Nat8; // La reaccion se especifica con el indice del array reactions    
    };
    
    #CommentReply : NotificationContext and {
      msg: Text;
    };

    #ProposalEvent: { // Notificaion global
      #New: Int;
      #Close: Int;
      #Approved: Int;
      #Rejected: Int;
    } 
  };

  public type Notification = {
    id : Int;
    date: Int;
    read: Bool;
    title : Text;
    kind : NotificationKind;
  };
};
